const express = require('express');
const router = express.Router();
const Nursery = require('./nursery');

const nursery = new Nursery();

router.post('/checkin', (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: 'Missing id or name in request body' });
  }
  nursery.checkInChild(id, name);
  res.json({ message: 'Child checked in successfully' });
});

router.post('/checkout', (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: 'Missing id in request body' });
  }
  nursery.checkOutChild(id);
  res.json({ message: 'Child checked out successfully' });
});

router.get('/checkedin', (req, res) => {
  const checkedInChildren = nursery.getCheckedInChildrenNames();
  res.json(checkedInChildren);
});

router.get('/checkedin/2hours', (req, res) => {
  const childrenCheckedInForTwoHours = nursery.getChildrenCheckedInForAtLeastTwoHours();
  res.json(childrenCheckedInForTwoHours);
});

module.exports = router;
