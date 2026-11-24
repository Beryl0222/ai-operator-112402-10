# 离线输入候选的分簇自适应 Softmax 与可证分页

这里的候选簇、尾页和可见字表是用于设备联调的合成资料。使用 Node.js 22。运行 `npm ci --offline` 核对依赖锁，`npm run inspect` 查看资料字段，`npm test` 检查资料格式及相互引用。检视脚本只读取元数据。

## 数据格式

概率是 (exp(g_c)/Σexp g)* (exp(l_w)/Σ_{w∈c}exp(l_w))。publicNormalizer 给尾簇预汇总的自然对数归一化常数，每个 tail 页有 logit 范围、规范字可能集合和未开 Tail 的质量上界。aliasMap 明确跨簇同一规范字的合并关系，按已知的唯一键去重概率贡献，禁用字仅从输出候选去掉，不重归一化。排序按合并概率降序，然后按公开 codepoint 顺序。精确概率展示与 Float64 reference 的绝对误差至 1e-7。profile.openLimit 指一次首屏实际尾页交付次数，turnLimit 跨相邻正式翻页计增量，workBytes 含已取页缓存、排序和证据等设备工作内存。取消时不把仍未知的概率质量写成零。 publicNormalizer 与页界可从 tail-index.json 按簇读出。索引按 v1 尾页 logits 固定，两版只改词的规范码。普通尾页的码从一个内部按页验证的私用码段顺序分配，索引给最小码、最大码以及偏离连续码规则的具体别名，三项合起来描述未知页的可能规范码集合。 v2 既允许语境变化引起簇头改变，也允许同一个尾页字典更新，两种变化须区分。游标从某次确定的排名顺延，变更词或上下文改变后不能把新条目挤到旧游标的前一页。用户可以从已有页回查继续选择，下一页另从当前语境的第一页开始。

## 取数

`inputs/tail-pages.json` 保存标定、规格和调用记录。记录中的范围除明确说明外从零开始，使用半开区间。批量数组按调用记录列出的顺序交付。tailHead(cluster,context) 给簇头 logit，tailPage(cluster,page,revision) 给尾页。字表以 v1、v2 区分。
