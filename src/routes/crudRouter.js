import { Router } from 'express';

export const buildCrudRouter = (controller) => {
  const router = Router({ mergeParams: true });

  router.post('/', controller.create);
  router.get('/', controller.list);
  router.get('/:id', controller.getById);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
};
