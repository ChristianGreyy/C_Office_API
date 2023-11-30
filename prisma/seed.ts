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
