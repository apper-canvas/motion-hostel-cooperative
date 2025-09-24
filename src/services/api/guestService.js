import guestsData from "@/services/mockData/guests.json";

class GuestService {
  constructor() {
    this.guests = [...guestsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.guests];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const guest = this.guests.find(guest => guest.Id === parseInt(id));
    if (!guest) {
      throw new Error("Guest not found");
    }
    return { ...guest };
  }

  async create(guestData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.guests.map(g => g.Id)) + 1;
    const newGuest = {
      Id: newId,
      ...guestData,
      status: "reserved"
    };
    this.guests.push(newGuest);
    return { ...newGuest };
  }

  async update(id, guestData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.guests.findIndex(guest => guest.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Guest not found");
    }
    this.guests[index] = {
      ...this.guests[index],
      ...guestData,
      Id: parseInt(id)
    };
    return { ...this.guests[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.guests.findIndex(guest => guest.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Guest not found");
    }
    const deleted = this.guests.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.guests.filter(guest => guest.status === status).map(guest => ({ ...guest }));
  }

  async checkIn(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.updateStatus(id, "checked-in");
  }

  async checkOut(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.updateStatus(id, "checked-out");
  }

  async updateStatus(id, status) {
    const index = this.guests.findIndex(guest => guest.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Guest not found");
    }
    this.guests[index].status = status;
    return { ...this.guests[index] };
  }
}

export default new GuestService();