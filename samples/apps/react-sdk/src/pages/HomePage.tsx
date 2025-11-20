/*
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import {
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@wso2/oxygen-ui";

// Dummy payroll data
const payrollSummary = {
  totalEmployees: 156,
  totalPayroll: "LKR 32,450,000.00",
  averageSalary: "LKR 208,013.00",
  pendingApprovals: 8,
};

const recentPayrolls = [
  {
    id: 1,
    employee: "Nimal Perera",
    employeeId: "EMP001",
    department: "Engineering",
    grossPay: "LKR 285,000.00",
    netPay: "LKR 228,000.00",
    status: "Processed",
    date: "2025-01-15",
  },
  {
    id: 2,
    employee: "Thilini Fernando",
    employeeId: "EMP002",
    department: "Sales",
    grossPay: "LKR 195,000.00",
    netPay: "LKR 156,000.00",
    status: "Processed",
    date: "2025-01-15",
  },
  {
    id: 3,
    employee: "Kasun Silva",
    employeeId: "EMP003",
    department: "Marketing",
    grossPay: "LKR 165,000.00",
    netPay: "LKR 132,000.00",
    status: "Pending",
    date: "2025-01-15",
  },
  {
    id: 4,
    employee: "Dilrukshi Jayawardena",
    employeeId: "EMP004",
    department: "Engineering",
    grossPay: "LKR 298,000.00",
    netPay: "LKR 238,400.00",
    status: "Processed",
    date: "2025-01-15",
  },
  {
    id: 5,
    employee: "Chaminda Rajapaksa",
    employeeId: "EMP005",
    department: "HR",
    grossPay: "LKR 220,000.00",
    netPay: "LKR 176,000.00",
    status: "Pending",
    date: "2025-01-15",
  },
  {
    id: 6,
    employee: "Sanduni Wickramasinghe",
    employeeId: "EMP006",
    department: "Finance",
    grossPay: "LKR 245,000.00",
    netPay: "LKR 196,000.00",
    status: "Processed",
    date: "2025-01-15",
  },
  {
    id: 7,
    employee: "Ruwan Dissanayake",
    employeeId: "EMP007",
    department: "Engineering",
    grossPay: "LKR 275,000.00",
    netPay: "LKR 220,000.00",
    status: "Processed",
    date: "2025-01-15",
  },
  {
    id: 8,
    employee: "Nimali Gunasekara",
    employeeId: "EMP008",
    department: "Marketing",
    grossPay: "LKR 145,000.00",
    netPay: "LKR 116,000.00",
    status: "Pending",
    date: "2025-01-15",
  },
  {
    id: 9,
    employee: "Asanka Bandara",
    employeeId: "EMP009",
    department: "Operations",
    grossPay: "LKR 185,000.00",
    netPay: "LKR 148,000.00",
    status: "Processed",
    date: "2025-01-15",
  },
  {
    id: 10,
    employee: "Madhavi Samaraweera",
    employeeId: "EMP010",
    department: "Sales",
    grossPay: "LKR 175,000.00",
    netPay: "LKR 140,000.00",
    status: "Pending",
    date: "2025-01-15",
  },
];

const HomePage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Payroll Dashboard
      </Typography>

      {/* Summary Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Employees
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {payrollSummary.totalEmployees}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Total Payroll
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {payrollSummary.totalPayroll}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Average Salary
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {payrollSummary.averageSalary}
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Pending Approvals
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: "warning.main" }}>
              {payrollSummary.pendingApprovals}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Recent Payrolls Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Recent Payroll Processing
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell align="right">Gross Pay</TableCell>
                  <TableCell align="right">Net Pay</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentPayrolls.map((payroll) => (
                  <TableRow key={payroll.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{payroll.employee}</TableCell>
                    <TableCell>{payroll.employeeId}</TableCell>
                    <TableCell>{payroll.department}</TableCell>
                    <TableCell align="right">{payroll.grossPay}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                      {payroll.netPay}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payroll.status}
                        size="small"
                        color={payroll.status === "Processed" ? "success" : "warning"}
                      />
                    </TableCell>
                    <TableCell>{payroll.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HomePage;
