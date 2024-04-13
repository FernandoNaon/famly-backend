const Nursery = require('./nursery');

describe('Nursery', () => {
  let nursery;

  beforeEach(() => {
    nursery = new Nursery();
  });

  test('checking in a child', () => {
    nursery.checkInChild(1, 'Alice');
    expect(nursery.children.length).toBe(1);
    expect(nursery.children[0].id).toBe(1);
    expect(nursery.children[0].name).toBe('Alice');
    expect(nursery.children[0].isCheckedIn()).toBe(true);
  });

  test('checking out a child', () => {
    nursery.checkInChild(1, 'Alice');
    nursery.checkOutChild(1);
    expect(nursery.children.length).toBe(1);
    expect(nursery.children[0].isCheckedIn()).toBe(false);
  });

  test('listing names of currently checked-in children', () => {
    nursery.checkInChild(1, 'Alice');
    nursery.checkInChild(2, 'Bob');
    nursery.checkOutChild(2);
    nursery.checkInChild(3, 'Charlie');
    const checkedInChildren = nursery.getCheckedInChildrenNames();
    expect(checkedInChildren).toEqual(['Alice', 'Charlie']);
  });
  
});
