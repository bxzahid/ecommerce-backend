const Admin = require('../models/Admin');
const Role = require('../models/Role');
const AppError = require('../utils/errors/AppError');

/* ======================================================================================
/* =============================== Add admin role into the req (middleware) ==========================
/* ====================================================================================== */

exports.findRoleById = async (req, res, next, _id) => {
  try {
    const role = await Role.findById(_id);
    if (!role) throw new AppError('Role not found', 404);
    req.role = role;
    return next();
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Create admin role ===========================================
/* ====================================================================================== */

exports.createRole = async (req, res, next) => {
  try {
    const { title, permissions } = req.body;

    const newRole = new Role({ title, permissions });
    await newRole.save();

    return res.status(201).json({ message: 'New role created successfully' });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== get all admin roles ===========================================
/* ====================================================================================== */

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find();
    if (roles.length === 0) return res.status(200).json({ message: 'There is no role' });
    return res.status(200).json(roles);
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== get admin role ===========================================
/* ====================================================================================== */

exports.getRole = async (req, res) => res.status(200).json(req.role);

/* ======================================================================================
/* =============================== edit/update admin role ===========================================
/* ====================================================================================== */

exports.editRole = async (req, res, next) => {
  try {
    const {
      role,
      body: { title },
    } = req;

    role.title = title;
    await role.save();

    return res.status(200).json({
      message: 'Update successfully',
      role,
    });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== Modify permissions to  a role =========================
/* ====================================================================================== */

exports.modifyPermissions = async (req, res, next) => {
  try {
    const {
      body: { permissions },
      role,
    } = req;

    role.permissions = [...permissions];

    await role.save();
    return res.status(200).json({
      message: 'Permission added successfully',
      role,
    });
  } catch (error) {
    return next(error);
  }
};

/* ======================================================================================
/* =============================== delete admin role ====================================
/* ====================================================================================== */

exports.deleteRole = async (req, res, next) => {
  try {
    const { role } = req;

    await Admin.findOneAndUpdate({ role: role._id }, { role: null });
    await role.remove();
    return res.status(200).json('Deleted successfully');
  } catch (error) {
    return next(error);
  }
};
