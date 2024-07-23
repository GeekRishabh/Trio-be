1. Web API(Backend Facing Frontend) for handling REST and WebSocket the codename is Nashville.
2. Task Manager micro-service which handles the logic. Its codename is Gallatin.
2. Logger micro-service that logs events to the console or another place in the future. Its codename is Ashland.

The Nashville BFF would interact with the Gallatin micro-service via GRPC.
- Both Microservices (Ashland, Gallatin) are connected to a RabbitMQ message broker.
- Gallatin should emit all logical events (e.g., a new Task has been created and so on.) to the Ashland.

The product owner needs this logic at the first glance:

- Create and update a Task which has these basic attributes.
o id: uuid
o ParentId: uuid
o title: string
o description: text
o createdAt: date or timestamp (auto generate by ORM)
o updatedAt: date or timestamp (auto generate by ORM)
- Every task can have a parent task. A Root task has a null parentId.
- Paginated list of tasks (complicated pagination in the tree is not needed).
- Delete a specific task by its id.

Use NestJS & TypeScript in all components (Both microservices and the BFF).
PostgreSQL database.
- ORM: TypeORM
- RabbitMQ message broker.
