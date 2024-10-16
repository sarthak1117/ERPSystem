const createPayroll = asyncHandler(async (req, res) => {
  const { role, staffId, month, year, basicSalary, earnings, deductions, tax } = req.body;

  // Validate input
  if (!role || !staffId) {
    throw new ApiError(400, 'Role and Staff ID are required');
  }

  // Fetch staff members by role
  const staffMembers = await Staff.find({ roles: role })
    .populate('Department')
    .populate('Designation');

  if (!staffMembers || staffMembers.length === 0) {
    throw new ApiError(404, 'No staff members found for the specified role');
  }

  // Find the specific staff member by staffId
  const staff = staffMembers.find(member => member._id.toString() === staffId);
  if (!staff) {
    throw new ApiError(404, 'Staff not found');
  }

  // Check for existing payroll for the same staff and month/year
  const existingPayroll = await Payroll.findOne({ staff: staffId, month, year });
  if (existingPayroll) {
    throw new ApiError(400, 'Payroll for this staff and month/year already exists');
  }

  // Calculate total earnings and deductions
  const totalEarnings = earnings.reduce((acc, item) => acc + item.amount, 0);
  const totalDeductions = deductions.reduce((acc, item) => acc + item.amount, 0);

  // Calculate gross salary and net salary
  const grossSalary = basicSalary + totalEarnings - totalDeductions;
  const netSalary = grossSalary - tax;

  // Create new payroll record
  const payroll = new Payroll({
    staff: staffId,
    month,
    year,
    earnings,
    deductions,
    payrollSummary: {
      basicSalary,
      totalEarnings,
      totalDeductions,
      grossSalary,
      tax,
      netSalary,
    },
  });

  // Save payroll record
  await payroll.save();

  // Include staff details in the response
  const staffDetails = {
    name: `${staff.FirstName} ${staff.LastName}`,
    email: staff.Email,
    staffId: staff.StaffId,
    phone: staff.Phone,
    epfNo: staff.EPFNo,
    designation: staff.Designation ? staff.Designation.Name : null,
    roles: staff.roles,
    department: staff.Department ? staff.Department.Name : null,
  };

  res.status(201).json({
    message: 'Payroll created successfully',
    payroll,
    staffDetails,
  });
});

const getPayment= asyncHandler(async (req, res) => {
    const { staffId, month, year } = req.query;
  
    try {
      if (!staffId || !month || !year) {
        return res.status(400).json({ message: 'Staff ID, month, and year are required' });
      }
  
      // Ensure staffId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(staffId)) {
        return res.status(400).json({ message: 'Invalid staff ID' });
      }
  
      const payrollsByStaff = await Payment.find({ month, year, staff: staffId });
      res.status(200).json(payrollsByStaff);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch payments', error });
    }
  });


  const proceedToPayment = asyncHandler(async (req, res) => {
    const { staffId, month, year, paymentMode, note } = req.body;

    // Log incoming request data
    console.log("Received payment request body:", req.body);

    // Validate input
    if (!staffId) {
        throw new ApiError(400, 'Staff ID is required');
    }

    if (!month || !year) {
        throw new ApiError(400, 'Month and year are required');
    }

    if (!paymentMode || !['check', 'cash', 'transfer to bank'].includes(paymentMode)) {
        throw new ApiError(400, 'Payment mode is invalid');
    }

    // Fetch payroll
    const payroll = await Payroll.findOne({ staff: staffId, month, year });
    if (!payroll) {
        throw new ApiError(404, 'Payroll not found');
    }

    if (!payroll.payrollGenerated) {
        throw new ApiError(400, 'Payroll has not been generated for this staff and month/year');
    }

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ staff: staffId, month, year });
    if (existingPayment) {
        throw new ApiError(400, 'Payment for this staff and month/year already exists');
    }

    // Use netSalary from payrollSummary as paymentAmount
    const paymentAmount = payroll.payrollSummary.netSalary;

    // Create new payment record
    const payment = new Payment({
        staff: staffId,
        month: payroll.month,
        year: payroll.year,
        paymentAmount,
        paymentMode,
        paymentDate: new Date(), // Current date
        note,
    });

    // Save payment record
    await payment.save();

    res.status(201).json({
        message: 'Payment processed successfully',
        payment,
    });
});

const getStaffByRole = asyncHandler(async (req, res) => {
  const { role, month, year } = req.query;

  if (!role) {
    throw new ApiError(400, 'Role is required');
  }

  // Fetch staff based on roles
  let staffQuery = Staff.find({ roles: role });

  // Optional: Filter by month and year if provided to exclude those who already have payroll created
  if (month && year) {
    const payrolls = await Payroll.find({ month, year }).select('staff');
    const staffWithPayroll = payrolls.map(p => p.staff.toString());
    staffQuery = staffQuery.where('_id').nin(staffWithPayroll);
  }

  const staffList = await staffQuery.populate('Department').populate('Designation');

  // Format staff data to include necessary details
  const staffDetails = staffList.map(staff => ({
    id: staff._id,
    name: `${staff.FirstName} ${staff.LastName}`,
    email: staff.Email,
    staffId: staff.StaffId,
    phone: staff.Phone,
    epfNo: staff.EPFNo,
    designation: staff.Designation ? staff.Designation.Name : null,
    roles: staff.roles,
    department: staff.Department ? staff.Department.Name : null,
  }));

  res.json({ staffDetails });
});