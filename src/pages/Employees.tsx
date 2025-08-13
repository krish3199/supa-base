import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Download, User, Briefcase, Phone, Mail } from 'lucide-react';
import EmployeeForm from '../components/EmployeeForm';

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  workExpertise: string;
  assignedClients: string[];
  assignedClientNames: string[];
  status: 'active' | 'inactive' | 'on_leave';
  salary: number;
  joinDate: string;
  createdAt: string;
}

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, statusFilter]);

  const fetchEmployees = async () => {
    try {
      setTimeout(() => {
        const demoEmployees: Employee[] = [
          {
            _id: '1',
            name: 'Alice Johnson',
            email: 'alice@company.com',
            phone: '+1 (555) 123-4567',
            skills: ['React', 'Node.js', 'MongoDB'],
            workExpertise: 'Full Stack Developer',
            assignedClients: ['1', '2'],
            assignedClientNames: ['Acme Corporation', 'Tech Solutions Inc'],
            status: 'active',
            salary: 75000,
            joinDate: '2024-01-15',
            createdAt: '2024-01-15'
          },
          {
            _id: '2',
            name: 'Bob Smith',
            email: 'bob@company.com',
            phone: '+1 (555) 987-6543',
            skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
            workExpertise: 'UI/UX Designer',
            assignedClients: ['3'],
            assignedClientNames: ['StartupCo'],
            status: 'active',
            salary: 65000,
            joinDate: '2024-02-01',
            createdAt: '2024-02-01'
          },
          {
            _id: '3',
            name: 'Carol Davis',
            email: 'carol@company.com',
            phone: '+1 (555) 456-7890',
            skills: ['Project Management', 'Agile', 'Scrum'],
            workExpertise: 'Project Manager',
            assignedClients: ['1'],
            assignedClientNames: ['Acme Corporation'],
            status: 'on_leave',
            salary: 80000,
            joinDate: '2023-11-10',
            createdAt: '2023-11-10'
          }
        ];
        setEmployees(demoEmployees);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.workExpertise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(employee => employee.status === statusFilter);
    }

    setFilteredEmployees(filtered);
  };

  const handleCreateEmployee = (employeeData: Omit<Employee, '_id' | 'createdAt'>) => {
    const newEmployee: Employee = {
      ...employeeData,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setEmployees([...employees, newEmployee]);
    setShowForm(false);
  };

  const handleUpdateEmployee = (employeeData: Omit<Employee, '_id' | 'createdAt'>) => {
    if (editingEmployee) {
      const updatedEmployees = employees.map(employee =>
        employee._id === editingEmployee._id
          ? { ...employee, ...employeeData }
          : employee
      );
      setEmployees(updatedEmployees);
      setEditingEmployee(null);
      setShowForm(false);
    }
  };

  const handleDeleteEmployee = (employeeId: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(employee => employee._id !== employeeId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => console.log('Export to Excel')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => {
              setEditingEmployee(null);
              setShowForm(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">
                {employees.filter(emp => emp.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-2xl font-bold text-yellow-600">
                {employees.filter(emp => emp.status === 'on_leave').length}
              </p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-lg">
              <User className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Salary</p>
              <p className="text-2xl font-bold text-purple-600">
                ${Math.round(employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expertise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Clients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {employee.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {employee.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{employee.workExpertise}</div>
                    <div className="text-sm text-gray-500">
                      Joined: {new Date(employee.joinDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {employee.skills.slice(0, 2).map((skill, index) => (
                        <span key={index} className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {skill}
                        </span>
                      ))}
                      {employee.skills.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          +{employee.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {employee.assignedClientNames.length > 0 ? (
                        <div>
                          {employee.assignedClientNames.slice(0, 2).map((clientName, index) => (
                            <div key={index} className="text-sm text-gray-900">{clientName}</div>
                          ))}
                          {employee.assignedClientNames.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{employee.assignedClientNames.length - 2} more
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">No assignments</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${employee.salary.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setEditingEmployee(employee);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEmployee(employee._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by adding a new employee.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Employee Form Modal */}
      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={editingEmployee ? handleUpdateEmployee : handleCreateEmployee}
          onCancel={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default Employees;