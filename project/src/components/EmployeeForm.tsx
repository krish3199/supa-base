import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

interface EmployeeFormProps {
  employee: Employee | null;
  onSubmit: (employeeData: Omit<Employee, '_id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: [] as string[],
    workExpertise: '',
    assignedClients: [] as string[],
    assignedClientNames: [] as string[],
    status: 'active' as 'active' | 'inactive' | 'on_leave',
    salary: 0,
    joinDate: ''
  });
  const [newSkill, setNewSkill] = useState('');

  const demoClients = [
    { id: '1', name: 'Acme Corporation' },
    { id: '2', name: 'Tech Solutions Inc' },
    { id: '3', name: 'StartupCo' }
  ];

  const expertiseOptions = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'UI/UX Designer',
    'Project Manager',
    'DevOps Engineer',
    'QA Engineer',
    'Data Analyst',
    'Marketing Specialist',
    'Business Analyst'
  ];

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        skills: employee.skills,
        workExpertise: employee.workExpertise,
        assignedClients: employee.assignedClients,
        assignedClientNames: employee.assignedClientNames,
        status: employee.status,
        salary: employee.salary,
        joinDate: employee.joinDate
      });
    } else {
      setFormData(prev => ({
        ...prev,
        joinDate: new Date().toISOString().split('T')[0]
      }));
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? parseFloat(value) || 0 : value
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleClientAssignment = (clientId: string, checked: boolean) => {
    const client = demoClients.find(c => c.id === clientId);
    if (!client) return;

    if (checked) {
      setFormData(prev => ({
        ...prev,
        assignedClients: [...prev.assignedClients, clientId],
        assignedClientNames: [...prev.assignedClientNames, client.name]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        assignedClients: prev.assignedClients.filter(id => id !== clientId),
        assignedClientNames: prev.assignedClientNames.filter(name => name !== client.name)
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onCancel}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {employee ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="workExpertise" className="block text-sm font-medium text-gray-700">
                    Work Expertise *
                  </label>
                  <select
                    id="workExpertise"
                    name="workExpertise"
                    required
                    value={formData.workExpertise}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select expertise</option>
                    {expertiseOptions.map(expertise => (
                      <option key={expertise} value={expertise}>{expertise}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    placeholder="Enter a skill"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Clients
                </label>
                <div className="space-y-2">
                  {demoClients.map(client => (
                    <label key={client.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.assignedClients.includes(client.id)}
                        onChange={(e) => handleClientAssignment(client.id, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{client.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                    Annual Salary ($) *
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    required
                    min="0"
                    step="1000"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
                    Join Date *
                  </label>
                  <input
                    type="date"
                    id="joinDate"
                    name="joinDate"
                    required
                    value={formData.joinDate}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {employee ? 'Update Employee' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;