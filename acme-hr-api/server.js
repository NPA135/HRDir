const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const port = 3000;

const sequelize = new Sequelize('postgres://postgres:npoe5030@localhost:5432/acme_hr', {
  dialect: 'postgres'
});

const Employee = sequelize.define('Employee', {
  name: DataTypes.STRING,
  role: DataTypes.STRING,
  departmentId: DataTypes.INTEGER,
});

const Department = sequelize.define('Department', {
  name: DataTypes.STRING,
});

Employee.belongsTo(Department);
Department.hasMany(Employee);

app.use(express.json());

app.get('/employees', async (req, res) => {
  const employees = await Employee.findAll();
  res.json(employees);
});

app.post('/employees', async (req, res) => {
  const newEmployee = await Employee.create(req.body);
  res.status(201).json(newEmployee);
});

app.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;
  await Employee.destroy({ where: { id } });
  res.status(204).send();
});

const seedData = async () => {
  await sequelize.sync({ force: true });

  const dept = await Department.create({ name: 'Engineering' });
  await Employee.create({ name: 'John Doe', role: 'Software Engineer', departmentId: dept.id });
};

seedData();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
