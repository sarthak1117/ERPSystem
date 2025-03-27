import { Permission } from './models/permission.models.js';
import { User } from './models/user.models.js';

const permissionsData = [
    { role: "admin", resource: "students", actions: ["create", "read", "update", "delete"] },
    { role: "admin", resource: "students/grades", actions: ["create", "read", "update", "delete"] },
    { role: "admin", resource: "students/attendance", actions: ["create", "read", "update", "delete"] },
    { role: "faculty", resource: "students", actions: ["create", "read", "update"] },
    { role: "faculty", resource: "students/grades", actions: ["read", "update"] },
    { role: "humanResource", resource: "students", actions: ["read", "update", "delete"] },
    { role: "student", resource: "courses", actions: ["read"] },
    { role: "student", resource: "assignments", actions: ["read", "submit"] },
    // Add more permissions for other roles and resources as needed
];

const seedPermissions = async () => {
    try {
        const users = await User.find();

        for (const permissionData of permissionsData) {
            const usersForRole = users.filter(user => user.roles.includes(permissionData.role));
            for (const user of usersForRole) {
                const existingPermission = await Permission.findOne({
                    user: user._id,
                    resource: permissionData.resource,
                    actions: { $all: permissionData.actions },
                });

                if (!existingPermission) {
                    await Permission.create({ user: user._id, ...permissionData });
                }
            }
        }

        console.log('Permissions have been successfully seeded');
    } catch (error) {
        console.error('Error seeding permissions:', error);
    } finally {
        mongoose.connection.close();
    }
};

export { seedPermissions };
