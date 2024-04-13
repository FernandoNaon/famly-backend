class Child {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.checkInTime = null;
  }

  checkIn() {
    this.checkInTime = new Date();
  }

  checkOut() {
    this.checkInTime = null;
  }

  isCheckedIn() {
    return this.checkInTime !== null;
  }

  getCheckedInDuration() {
    if (!this.isCheckedIn()) return 0;
    const currentTime = new Date();
    return Math.floor((currentTime - this.checkInTime) / (1000 * 60 * 60)); // Hours
  }
}

class Nursery {
  constructor() {
    this.children = [];
  }

  // 1 - Checking a child in.

  checkInChild(id, name) {
    const child = new Child(id, name);
    child.checkIn();
    this.children.push(child);
  }

  // 2 - Checking a child out.

  checkOutChild(id) {
    const child = this.children.find((c) => c.id === id);
    if (child) {
      child.checkOut();
    }
  }

  // 3 - Listing the names of all children that are currently checked in.

  getCheckedInChildrenNames() {
    return this.children
      .filter((child) => child.isCheckedIn())
      .map((child) => child.name);
  }

  // 4 - Getting a list of children that was checked in for at least 2 hours today. 
  
  getChildrenCheckedInForAtLeastTwoHours() {
    const currentTime = new Date();
    return this.children.filter(
      (child) => child.isCheckedIn() && child.getCheckedInDuration() >= 2
    );
  }
}

module.exports = Nursery;
