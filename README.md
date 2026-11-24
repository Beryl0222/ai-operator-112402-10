# 可撤热词覆盖的端侧嵌入码本收缩

项目资料使用可独立读写的 JSON。Node.js 22.23.4 下运行 `npm ci --offline` 准备环境，然后运行 `npm run inspect` 检查合成数据字段，运行 `npm test` 校验样本引用及格式。

## 输入契约

词包按 scope 与 spelling 定位映射，priority 较高者优先，优先级相同且同时有映射时视为源冲突。词组向量为子词位置权重乘以各子词向量之和。子词向量的各码本层为可加的浮点向量；层不一定会立即可读取。已跳过各层有已知 L2 上界，词组误差以 L2 判断；无法从已知输入保证时可以使用更多层或返回待补。码本页读取资格以当前词包版本与 session 中的 scope 限定，当前查询和历史回读是不同操作。设备预算为运行时同时保留的已解码页数。 personal 会话可读取适用的 personal 与 general 映射，general 会话只能读取 general。包 scope 与其实际页范围同时有效。已交付历史引用不得被通用查询使用。

## 资料读取

样本位于 `inputs/session.json`，其中 `events` 是按到达顺序记下的操作，编号从零开始。activate、withdraw 操作词包 ID，lookup 给出会话、scope、拼写与误差容限。history 按会话和先前 lookup 在事件中的零基位置读回。
