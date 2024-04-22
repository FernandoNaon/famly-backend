class Child {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.checkInTime = null;
  }

  checkIn() {
    this.checkInTime = new Date();
    // const currentTime = new Date();
    // this.checkInTime = new Date(currentTime.getTime() - 3 * 60 * 60 * 1000);
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
    const checkInTime = new Date(this.checkInTime);
    const durationInMilliseconds = currentTime - checkInTime;
    return Math.floor(durationInMilliseconds / (1000 * 60 * 60));
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.children.filter((child) => {
      if (!child.isCheckedIn()) return false;

      const checkInDate = new Date(child.checkInTime);

      if (checkInDate < today) return false;
      const durationInHours = child.getCheckedInDuration();

      return durationInHours >= 2;
    });
  }
}

const myNursery = new Nursery();

myNursery.checkInChild(1, "Alice");
myNursery.checkInChild(2, "Bob");
myNursery.checkInChild(3, "Charlie");

myNursery.checkOutChild(3);

console.log("Checked-in children:", myNursery.getCheckedInChildrenNames());
console.log(
  "Children checked in for at least two hours:",
  myNursery.getChildrenCheckedInForAtLeastTwoHours()
);

module.exports = Nursery;
