import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.permission.createMany({
    data: [
      // users
      {
        module: 'users',
        name: 'Create user',
        slug: 'create_user',
      },
      {
        module: 'users',
        name: 'Get all users',
        slug: 'get_users',
      },
      {
        module: 'users',
        name: 'Get user',
        slug: 'get_user',
      },
      {
        module: 'users',
        name: 'Update user',
        slug: 'update_user',
      },
      {
        module: 'users',
        name: 'Delete user',
        slug: 'delete_user',
      },
      // roles
      {
        module: 'roles',
        name: 'Create role',
        slug: 'create_role',
      },
      {
        module: 'roles',
        name: 'Get all roles',
        slug: 'get_roles',
      },
      {
        module: 'roles',
        name: 'Get role',
        slug: 'get_role',
      },
      {
        module: 'roles',
        name: 'Update role',
        slug: 'update_role',
      },
      {
        module: 'roles',
        name: 'Delete role',
        slug: 'delete_role',
      },
      // permissions
      {
        module: 'permissions',
        name: 'Create permission',
        slug: 'create_permission',
      },
      {
        module: 'permissions',
        name: 'Get all permissions',
        slug: 'get_permissions',
      },
      {
        module: 'permissions',
        name: 'Get permission',
        slug: 'get_permission',
      },
      {
        module: 'permissions',
        name: 'Update permission',
        slug: 'update_permission',
      },
      {
        module: 'permissions',
        name: 'Delete permission',
        slug: 'delete_permission',
      },
      // positions
      {
        module: 'positions',
        name: 'Create position',
        slug: 'create_position',
      },
      {
        module: 'positions',
        name: 'Get all positions',
        slug: 'get_positions',
      },
      {
        module: 'positions',
        name: 'Get position',
        slug: 'get_position',
      },
      {
        module: 'positions',
        name: 'Update position',
        slug: 'update_position',
      },
      {
        module: 'positions',
        name: 'Delete position',
        slug: 'delete_position',
      },
      // levels
      {
        module: 'levels',
        name: 'Create level',
        slug: 'create_level',
      },
      {
        module: 'levels',
        name: 'Get all levels',
        slug: 'get_levels',
      },
      {
        module: 'levels',
        name: 'Get level',
        slug: 'get_level',
      },
      {
        module: 'levels',
        name: 'Update level',
        slug: 'update_level',
      },
      {
        module: 'levels',
        name: 'Delete level',
        slug: 'delete_level',
      },
      // universities
      {
        module: 'universities',
        name: 'Create university',
        slug: 'create_university',
      },
      {
        module: 'universities',
        name: 'Get all universities',
        slug: 'get_universities',
      },
      {
        module: 'universities',
        name: 'Get university',
        slug: 'get_university',
      },
      {
        module: 'universities',
        name: 'Update university',
        slug: 'update_university',
      },
      {
        module: 'universities',
        name: 'Delete university',
        slug: 'delete_university',
      },
      // trackers
      {
        module: 'trackers',
        name: 'Create tracker',
        slug: 'create_tracker',
      },
      {
        module: 'trackers',
        name: 'Get all trackers',
        slug: 'get_trackers',
      },
      {
        module: 'trackers',
        name: 'Get tracker',
        slug: 'get_tracker',
      },
      {
        module: 'trackers',
        name: 'Update tracker',
        slug: 'update_tracker',
      },
      {
        module: 'trackers',
        name: 'Delete tracker',
        slug: 'delete_tracker',
      },
      // priorities
      {
        module: 'priorities',
        name: 'Create priority',
        slug: 'create_priority',
      },
      {
        module: 'priorities',
        name: 'Get all priorities',
        slug: 'get_priorities',
      },
      {
        module: 'priorities',
        name: 'Get priority',
        slug: 'get_priority',
      },
      {
        module: 'priorities',
        name: 'Update priority',
        slug: 'update_priority',
      },
      {
        module: 'priorities',
        name: 'Delete priority',
        slug: 'delete_priority',
      },
      // status
      {
        module: 'status',
        name: 'Create status',
        slug: 'create_status',
      },
      {
        module: 'status',
        name: 'Get all status',
        slug: 'get_all_status',
      },
      {
        module: 'status',
        name: 'Get status',
        slug: 'get_status',
      },
      {
        module: 'status',
        name: 'Update status',
        slug: 'update_status',
      },
      {
        module: 'status',
        name: 'Delete status',
        slug: 'delete_status',
      },
      // categories
      {
        module: 'categories',
        name: 'Create category',
        slug: 'create_category',
      },
      {
        module: 'categories',
        name: 'Get all categories',
        slug: 'get_categories',
      },
      {
        module: 'categories',
        name: 'Get category',
        slug: 'get_category',
      },
      {
        module: 'categories',
        name: 'Update category',
        slug: 'update_category',
      },
      {
        module: 'categories',
        name: 'Delete category',
        slug: 'delete_category',
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
