const express = require('express');
const Todo = require('../models/todo.js');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hi');
});

router.post('/todos', async (req, res) => {
  const { value } = req.body;
  const maxOrderByUserId = await Todo.findOne().sort('-order').exec();

  const order = maxOrderByUserId
    ? maxOrderByUserId.order + 1 // maxOrderByUserId가 있을 때,
    : 1; // maxOrderByUserId가 없을 때

  const todo = new Todo({ value, order });
  await todo.save();

  res.send({ todo });
});

router.get('/todos', async (req, res) => {
  const todos = await Todo.find().sort('-order').exec(); // 특정 조건 입력 X일 경우, 모든 데이터 조회 / order앞에 -붙이면 내림차순!

  res.send({ todos });
});

router.patch('/todos/:todoId', async (req, res) => {
  const { todoId } = req.params;
  const { order } = req.body;

  // 1. todoId에 해당하는 할 일이 있는가?
  // 1-1. todoId에 해당하는 할 일이 없으면, 에러를 출력해야 함.
  const currentTodo = await Todo.findById(todoId);
  if (!currentTodo) {
    return res
      .status(400)
      .json({ errorMessage: '존재하지 않는 할 일 입니다.' });
  }

  if (order) {
    const targetTodo = await Todo.findOne({ order }).exec();
    if (targetTodo) {
      targetTodo.order = currentTodo.order;
      await targetTodo.save(); // 2번째 -> 1번째 변경 / 바꾸려는 대상이 존재한다면, 그것부터 변경하고,
    }
    currentTodo.order = order;
    await currentTodo.save(); // 1번째 -> 2번째 변경 / 그 다음에 자신을 수정하기.
  }

  res.send();
});

module.exports = router;
