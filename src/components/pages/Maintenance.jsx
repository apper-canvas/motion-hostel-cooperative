import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";
import maintenanceService from "@/services/api/maintenanceService";
import roomService from "@/services/api/roomService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { toast } from "react-toastify";

const Input = ({ className, ...props }) => (
  <input
    className={cn(
      "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
      className
    )}
    {...props}
  />
);

const Select = ({ className, children, ...props }) => (
  <select
    className={cn(
      "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white",
      className
    )}
    {...props}
  >
    {children}
  </select>
);

const Textarea = ({ className, ...props }) => (
  <textarea
    className={cn(
      "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none",
      className
    )}
    {...props}
  />
);

const MaintenanceListItem = ({ maintenance, isSelected, onClick }) => {
  const getPriorityVariant = (priority) => {
    const variants = {
      "High": "error",
      "Medium": "warning", 
      "Low": "info"
    };
    return variants[priority] || "default";
  };

  const getStatusVariant = (status) => {
    const variants = {
      "Pending": "warning",
      "Scheduled": "info",
      "In Progress": "info",
      "Completed": "available"
    };
    return variants[status] || "default";
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      "High": "AlertTriangle",
      "Medium": "AlertCircle",
      "Low": "Info"
    };
    return icons[priority] || "Circle";
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected && "ring-2 ring-primary border-primary"
      )}
      onClick={() => onClick(maintenance)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{maintenance.title}</h3>
          <div className="flex space-x-2">
            <Badge variant={getPriorityVariant(maintenance.priority)} size="sm">
              {maintenance.priority}
            </Badge>
            <Badge variant={getStatusVariant(maintenance.status)} size="sm">
              {maintenance.status}
            </Badge>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Home" size={14} className="mr-2" />
            Room {maintenance.roomNumber}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="User" size={14} className="mr-2" />
            {maintenance.assignedStaff}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="DollarSign" size={14} className="mr-2" />
            ${maintenance.estimatedCost || 0}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MaintenanceForm = ({ maintenance, onSave, onCancel, isEditing, rooms }) => {
  const [formData, setFormData] = useState({
    roomId: maintenance?.roomId || "",
    title: maintenance?.title || "",
    description: maintenance?.description || "",
    priority: maintenance?.priority || "Medium",
    status: maintenance?.status || "Pending",
    assignedStaff: maintenance?.assignedStaff || "",
    reportedBy: maintenance?.reportedBy || "",
    scheduledDate: maintenance?.scheduledDate?.split('T')[0] || "",
    estimatedCost: maintenance?.estimatedCost || "",
    notes: maintenance?.notes || "",
    category: maintenance?.category || "General"
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedRoom = rooms.find(r => r.Id === parseInt(formData.roomId));
      const maintenanceData = {
        ...formData,
        roomId: parseInt(formData.roomId),
        roomNumber: selectedRoom?.number || "",
        estimatedCost: parseFloat(formData.estimatedCost) || 0,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : null
      };

      let savedMaintenance;
      if (isEditing) {
        savedMaintenance = await maintenanceService.update(maintenance.Id, maintenanceData);
        toast.success("Maintenance request updated successfully");
      } else {
        savedMaintenance = await maintenanceService.create(maintenanceData);
        toast.success("Maintenance request created successfully");
      }

      onSave(savedMaintenance);
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} maintenance request: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room
          </label>
          <Select
            value={formData.roomId}
            onChange={(e) => setFormData(prev => ({ ...prev, roomId: e.target.value }))}
            required
          >
            <option value="">Select Room</option>
            {rooms.map(room => (
              <option key={room.Id} value={room.Id}>
                Room {room.number} - {room.type}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <Select
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
            required
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Brief description of the issue"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Detailed description of the maintenance issue"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <Select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            required
          >
            <option value="General">General</option>
            <option value="HVAC">HVAC</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Furniture">Furniture</option>
            <option value="Technology">Technology</option>
            <option value="Security">Security</option>
            <option value="Cleaning">Cleaning</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assigned Staff
          </label>
          <Input
            value={formData.assignedStaff}
            onChange={(e) => setFormData(prev => ({ ...prev, assignedStaff: e.target.value }))}
            placeholder="Staff member name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reported By
          </label>
          <Input
            value={formData.reportedBy}
            onChange={(e) => setFormData(prev => ({ ...prev, reportedBy: e.target.value }))}
            placeholder="Person reporting the issue"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Date
          </label>
          <Input
            type="date"
            value={formData.scheduledDate}
            onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Cost ($)
          </label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.estimatedCost}
            onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <Textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes or comments"
        />
      </div>

      <div className="flex space-x-3 pt-4 border-t border-gray-200">
        <Button type="submit" loading={loading} className="flex-1">
          {isEditing ? 'Update Request' : 'Create Request'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
};

const MaintenanceDetails = ({ maintenance, onEdit, onStatusChange }) => {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      await maintenanceService.updateStatus(maintenance.Id, newStatus);
      toast.success(`Maintenance request status updated to ${newStatus}`);
      onStatusChange();
    } catch (error) {
      toast.error(`Failed to update status: ${error.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getPriorityVariant = (priority) => {
    const variants = {
      "High": "error",
      "Medium": "warning",
      "Low": "info"
    };
    return variants[priority] || "default";
  };

  const getStatusVariant = (status) => {
    const variants = {
      "Pending": "warning",
      "Scheduled": "info",
      "In Progress": "info",
      "Completed": "available"
    };
    return variants[status] || "default";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{maintenance.title}</h2>
          <p className="text-gray-600">Room {maintenance.roomNumber} • {maintenance.category}</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant={getPriorityVariant(maintenance.priority)} size="lg">
            {maintenance.priority} Priority
          </Badge>
          <Badge variant={getStatusVariant(maintenance.status)} size="lg">
            {maintenance.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Request Details</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <ApperIcon name="FileText" size={16} className="mr-3 text-gray-500" />
                <span className="text-sm text-gray-600">{maintenance.description}</span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="User" size={16} className="mr-3 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Assigned to {maintenance.assignedStaff}
                </span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="UserCheck" size={16} className="mr-3 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Reported by {maintenance.reportedBy}
                </span>
              </div>
              <div className="flex items-center">
                <ApperIcon name="Calendar" size={16} className="mr-3 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Reported {new Date(maintenance.reportedDate).toLocaleDateString()}
                </span>
              </div>
              {maintenance.scheduledDate && (
                <div className="flex items-center">
                  <ApperIcon name="Clock" size={16} className="mr-3 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Scheduled {new Date(maintenance.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {maintenance.completedDate && (
                <div className="flex items-center">
                  <ApperIcon name="CheckCircle" size={16} className="mr-3 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Completed {new Date(maintenance.completedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Cost & Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estimated Cost:</span>
                <span className="font-medium">${maintenance.estimatedCost || 0}</span>
              </div>
              {maintenance.actualCost && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Actual Cost:</span>
                  <span className="font-medium">${maintenance.actualCost}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Category:</span>
                <span className="font-medium">{maintenance.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Priority:</span>
                <Badge variant={getPriorityVariant(maintenance.priority)} size="sm">
                  {maintenance.priority}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {maintenance.notes && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
            <p className="text-sm text-gray-600">{maintenance.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Status
              </label>
              <div className="flex space-x-2">
                {["Pending", "Scheduled", "In Progress", "Completed"].map((status) => (
                  <Button
                    key={status}
                    size="sm"
                    variant={maintenance.status === status ? "primary" : "secondary"}
                    onClick={() => handleStatusChange(status)}
                    disabled={maintenance.status === status || updatingStatus}
                    loading={updatingStatus && maintenance.status !== status}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <Button onClick={onEdit} leftIcon="Edit" className="w-full">
                Edit Request Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [maintenanceData, roomsData] = await Promise.all([
        maintenanceService.getAll(),
        roomService.getAll()
      ]);
      setMaintenance(maintenanceData);
      setRooms(roomsData);
      
      // Update selected maintenance if it exists
      if (selectedMaintenance) {
        const updatedSelected = maintenanceData.find(m => m.Id === selectedMaintenance.Id);
        if (updatedSelected) {
          setSelectedMaintenance(updatedSelected);
        }
      }
    } catch (err) {
      setError("Failed to load maintenance data");
      toast.error("Failed to load maintenance requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMaintenanceClick = (maintenanceItem) => {
    setSelectedMaintenance(maintenanceItem);
    setShowForm(false);
    setEditingMaintenance(null);
  };

  const handleAddMaintenance = () => {
    setShowForm(true);
    setSelectedMaintenance(null);
    setEditingMaintenance(null);
  };

  const handleEditMaintenance = () => {
    setEditingMaintenance(selectedMaintenance);
    setShowForm(true);
  };

  const handleFormSave = (savedMaintenance) => {
    loadData();
    setShowForm(false);
    setEditingMaintenance(null);
    setSelectedMaintenance(savedMaintenance);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMaintenance(null);
  };

  const filteredMaintenance = maintenance.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.assignedStaff.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || item.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Management</h1>
        <p className="text-gray-600">Track and manage room maintenance requests and repairs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="lg:col-span-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardContent className="p-4 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Maintenance Requests</h2>
                <Button onClick={handleAddMaintenance} leftIcon="Plus" size="sm">
                  Add Request
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Select>

                  <Select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option value="All">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </Select>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3">
                {filteredMaintenance.map((item) => (
                  <MaintenanceListItem
                    key={item.Id}
                    maintenance={item}
                    isSelected={selectedMaintenance?.Id === item.Id}
                    onClick={handleMaintenanceClick}
                  />
                ))}
                {filteredMaintenance.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="Search" size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No maintenance requests found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardContent className="p-6 h-full overflow-y-auto">
              {showForm ? (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {editingMaintenance ? 'Edit Maintenance Request' : 'Add New Maintenance Request'}
                  </h2>
                  <MaintenanceForm
                    maintenance={editingMaintenance}
                    rooms={rooms}
                    onSave={handleFormSave}
                    onCancel={handleFormCancel}
                    isEditing={!!editingMaintenance}
                  />
                </div>
              ) : selectedMaintenance ? (
                <MaintenanceDetails
                  maintenance={selectedMaintenance}
                  onEdit={handleEditMaintenance}
                  onStatusChange={loadData}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-center">
                  <div>
                    <ApperIcon name="Wrench" size={64} className="mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Select a maintenance request to view details
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Choose a request from the list to view and manage its details
                    </p>
                    <Button onClick={handleAddMaintenance} leftIcon="Plus">
                      Add New Request
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;