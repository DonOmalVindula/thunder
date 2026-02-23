/*
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package userschema

import (
	"context"
	"errors"

	"github.com/asgardeo/thunder/internal/system/cache"
	"github.com/asgardeo/thunder/internal/system/log"
)

const cacheBackedStoreLoggerComponentName = "CachedBackedUserSchemaStore"

// cachedBackedUserSchemaStore is the implementation of userSchemaStoreInterface that uses caching.
type cachedBackedUserSchemaStore struct {
	schemaByIDCache   cache.CacheInterface[*UserSchema]
	schemaByNameCache cache.CacheInterface[*UserSchema]
	store             userSchemaStoreInterface
}

// newCachedBackedUserSchemaStore creates a new instance of cachedBackedUserSchemaStore.
func newCachedBackedUserSchemaStore(store userSchemaStoreInterface) userSchemaStoreInterface {
	return &cachedBackedUserSchemaStore{
		schemaByIDCache:   cache.GetCache[*UserSchema]("UserSchemaByIDCache"),
		schemaByNameCache: cache.GetCache[*UserSchema]("UserSchemaByNameCache"),
		store:             store,
	}
}

// GetUserSchemaListCount delegates to the underlying store.
func (cs *cachedBackedUserSchemaStore) GetUserSchemaListCount(ctx context.Context) (int, error) {
	return cs.store.GetUserSchemaListCount(ctx)
}

// GetUserSchemaList delegates to the underlying store.
func (cs *cachedBackedUserSchemaStore) GetUserSchemaList(
	ctx context.Context, limit, offset int,
) ([]UserSchemaListItem, error) {
	return cs.store.GetUserSchemaList(ctx, limit, offset)
}

// CreateUserSchema creates a new user schema and caches it.
func (cs *cachedBackedUserSchemaStore) CreateUserSchema(ctx context.Context, userSchema UserSchema) error {
	if err := cs.store.CreateUserSchema(ctx, userSchema); err != nil {
		return err
	}
	cs.cacheUserSchema(&userSchema)
	return nil
}

// GetUserSchemaByID retrieves a user schema by ID, using cache if available.
func (cs *cachedBackedUserSchemaStore) GetUserSchemaByID(
	ctx context.Context, schemaID string,
) (UserSchema, error) {
	cacheKey := cache.CacheKey{Key: schemaID}
	if cached, ok := cs.schemaByIDCache.Get(cacheKey); ok {
		return *cached, nil
	}

	schema, err := cs.store.GetUserSchemaByID(ctx, schemaID)
	if err != nil {
		return schema, err
	}
	cs.cacheUserSchema(&schema)
	return schema, nil
}

// GetUserSchemaByName retrieves a user schema by name, using cache if available.
func (cs *cachedBackedUserSchemaStore) GetUserSchemaByName(
	ctx context.Context, name string,
) (UserSchema, error) {
	cacheKey := cache.CacheKey{Key: name}
	if cached, ok := cs.schemaByNameCache.Get(cacheKey); ok {
		return *cached, nil
	}

	schema, err := cs.store.GetUserSchemaByName(ctx, name)
	if err != nil {
		return schema, err
	}
	cs.cacheUserSchema(&schema)
	return schema, nil
}

// UpdateUserSchemaByID updates a user schema and refreshes the cache.
func (cs *cachedBackedUserSchemaStore) UpdateUserSchemaByID(
	ctx context.Context, schemaID string, userSchema UserSchema,
) error {
	if err := cs.store.UpdateUserSchemaByID(ctx, schemaID, userSchema); err != nil {
		return err
	}

	cs.invalidateCache(schemaID, userSchema.Name)
	cs.cacheUserSchema(&userSchema)
	return nil
}

// DeleteUserSchemaByID deletes a user schema and invalidates the cache.
func (cs *cachedBackedUserSchemaStore) DeleteUserSchemaByID(ctx context.Context, schemaID string) error {
	// Get existing schema to find the name for cache invalidation.
	cacheKey := cache.CacheKey{Key: schemaID}
	existing, ok := cs.schemaByIDCache.Get(cacheKey)
	if !ok {
		fetched, err := cs.store.GetUserSchemaByID(ctx, schemaID)
		if err != nil {
			if errors.Is(err, ErrUserSchemaNotFound) {
				return nil
			}
			return err
		}
		existing = &fetched
	}

	if err := cs.store.DeleteUserSchemaByID(ctx, schemaID); err != nil {
		return err
	}

	if existing != nil {
		cs.invalidateCache(existing.ID, existing.Name)
	}
	return nil
}

// cacheUserSchema caches the user schema by both ID and name.
func (cs *cachedBackedUserSchemaStore) cacheUserSchema(schema *UserSchema) {
	if schema == nil {
		return
	}
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, cacheBackedStoreLoggerComponentName))

	if schema.ID != "" {
		if err := cs.schemaByIDCache.Set(cache.CacheKey{Key: schema.ID}, schema); err != nil {
			logger.Error("Failed to cache user schema by ID",
				log.String("schemaID", schema.ID), log.Error(err))
		}
	}
	if schema.Name != "" {
		if err := cs.schemaByNameCache.Set(cache.CacheKey{Key: schema.Name}, schema); err != nil {
			logger.Error("Failed to cache user schema by name",
				log.String("schemaName", schema.Name), log.Error(err))
		}
	}
}

// invalidateCache removes the user schema from both caches.
func (cs *cachedBackedUserSchemaStore) invalidateCache(schemaID, schemaName string) {
	logger := log.GetLogger().With(log.String(log.LoggerKeyComponentName, cacheBackedStoreLoggerComponentName))

	if schemaID != "" {
		if err := cs.schemaByIDCache.Delete(cache.CacheKey{Key: schemaID}); err != nil {
			logger.Error("Failed to delete user schema cache by ID",
				log.String("schemaID", schemaID), log.Error(err))
		}
	}
	if schemaName != "" {
		if err := cs.schemaByNameCache.Delete(cache.CacheKey{Key: schemaName}); err != nil {
			logger.Error("Failed to delete user schema cache by name",
				log.String("schemaName", schemaName), log.Error(err))
		}
	}
}
