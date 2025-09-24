import roomsData from "@/services/mockData/rooms.json";

class RoomService {
  constructor() {
    this.rooms = [...roomsData];
  }

  async getAll() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.rooms];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const room = this.rooms.find(room => room.Id === parseInt(id));
    if (!room) {
      throw new Error("Room not found");
    }
    return { ...room };
  }

  async create(roomData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.rooms.map(r => r.Id)) + 1;
    const newRoom = {
      Id: newId,
      ...roomData,
      lastUpdated: new Date().toISOString()
    };
    this.rooms.push(newRoom);
    return { ...newRoom };
  }

  async update(id, roomData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.rooms.findIndex(room => room.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Room not found");
    }
    this.rooms[index] = {
      ...this.rooms[index],
      ...roomData,
      Id: parseInt(id),
      lastUpdated: new Date().toISOString()
    };
    return { ...this.rooms[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.rooms.findIndex(room => room.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Room not found");
    }
    const deleted = this.rooms.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.rooms.filter(room => room.status === status).map(room => ({ ...room }));
  }

  async updateStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.rooms.findIndex(room => room.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Room not found");
    }
    this.rooms[index].status = status;
    this.rooms[index].lastUpdated = new Date().toISOString();
    return { ...this.rooms[index] };
  }
}

export default new RoomService();