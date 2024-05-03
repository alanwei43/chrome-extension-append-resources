import React, { useEffect, useState } from "react";
import { getCurrentUrl, readStorage, writeStorage } from "./library";

export default function App() {
  const [list, setList] = useState<AppendResource[]>([]);
  const [currentResource, setCurrentResource] = useState<AppendResource>({
    matchRule: "startWith",
    matchUrl: location.href,
    resType: "js-url",
    resValue: "",
  });

  useEffect(() => {
    // 初始化
    (async () => {
      const url = await getCurrentUrl();
      setCurrentResource(prev => ({
        ...prev,
        matchUrl: url || "",
      }));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await readStorage<AppendResource[]>("resources");
      setList(data || []);
    })();
  }, []);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    if (currentResource.id) {
      // 编辑
    } else {
      // 新增
      list.push({ ...currentResource, id: randomId() });
      setList([...list]);
      writeStorage("resources", list);
    }
    setCurrentResource({
      ...currentResource,
      resValue: "",
      id: undefined,
    });
  };

  const removeResource = (index: number) => {
    const removed = list.splice(index, 1);
    console.log(removed);
    setList([...list]);
  };

  const editResource = (index: number) => {
    const resource = list[index];
    setCurrentResource(resource);
  };

  const cancelEdit = () => {
    setCurrentResource({ ...currentResource, id: undefined });
  };

  const matchRules: Array<{ value: AppendResource["matchRule"]; name: string }> = [
    { value: "extra", name: "完整匹配" },
    { value: "regexp", name: "正则匹配" },
    { value: "startWith", name: "开始匹配" },
  ];
  const resTypes: Array<{ value: AppendResource["resType"]; name: string }> = [
    { value: "css-raw", name: "CSS 代码" },
    { value: "css-url", name: "CSS URL" },
    { value: "js-raw", name: "JS 代码" },
    { value: "js-url", name: "JS URL" },
  ];

  const renderResourcesList = list.map(resource => ({
    ...resource,
    matchRuleName: matchRules.find(r => r.value === resource.matchRule)?.name,
    resTypeName: resTypes.find(r => r.value === resource.resType)?.name,
  }));

  const isEditing = !!currentResource.id;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xxl-6 col-xl-12 my-2">
          <div className="card">
            <div className="card-header">已存在资源列表</div>
            <div className="card-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>匹配规则</th>
                    <th>匹配URL</th>
                    <th>资源类型</th>
                    <th>资源的值</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {renderResourcesList.map((resource, index) => (
                    <tr key={resource.id}>
                      <td>{resource.id?.split("-")[0]}</td>
                      <td>{resource.matchRuleName}</td>
                      <td>{resource.matchUrl}</td>
                      <td>{resource.resTypeName}</td>
                      <td>{resource.resValue}</td>
                      <td>
                        <span
                          className="btn btn-danger"
                          onClick={() => removeResource(index)}>
                          删除
                        </span>
                        <span
                          className="btn btn-primary mx-2"
                          onClick={() => editResource(index)}>
                          编辑
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-xxl-6 col-xl-12 my-2">
          <div className="card">
            <div className="card-header">{isEditing ? `编辑附加资源(${currentResource.id})` : "新增附加资源"}</div>

            <form onSubmit={onSubmit}>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">匹配的规则</label>
                  <select
                    className="form-control"
                    value={currentResource.matchRule}
                    onChange={e => setCurrentResource({ ...currentResource, matchRule: e.target.value as AppendResource["matchRule"] })}>
                    {matchRules.map(rule => (
                      <option
                        key={rule.value}
                        value={rule.value}>
                        {rule.name}
                      </option>
                    ))}
                  </select>
                  <div className="form-text tw-text-yellow-400">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">匹配的URL</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentResource.matchUrl}
                    onChange={e => setCurrentResource({ ...currentResource, matchUrl: e.target.value })}
                  />
                  <div className="form-text tw-text-yellow-400">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">附加的资源类型</label>
                  <select
                    className="form-control"
                    value={currentResource.resType}
                    onChange={e => setCurrentResource({ ...currentResource, resType: e.target.value as AppendResource["resType"] })}>
                    {resTypes.map(res => (
                      <option
                        key={res.value}
                        value={res.value}>
                        {res.name}
                      </option>
                    ))}
                  </select>
                  <div className="form-text tw-text-yellow-400">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                  <label className="form-label">附加的资源内容</label>
                  {currentResource.resType.includes("raw") ? (
                    <textarea
                      className="form-control tw-font-code"
                      value={currentResource.resValue}
                      onChange={e => setCurrentResource({ ...currentResource, resValue: e.target.value })}></textarea>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      value={currentResource.resValue}
                      onChange={e => setCurrentResource({ ...currentResource, resValue: e.target.value })}
                    />
                  )}
                  <div className="form-text tw-text-yellow-400">We'll never share your email with anyone else.</div>
                </div>
              </div>
              <div className="card-footer">
                <button
                  type="submit"
                  className="btn btn-info tw-text-white hover:tw-text-white">
                  {isEditing ? "更新" : "新增"}
                </button>
                {isEditing && (
                  <span
                    className="btn btn-warning mx-1 tw-text-white hover:tw-text-white"
                    onClick={cancelEdit}>
                    取消编辑
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

type AppendResource = {
  id?: string;
  matchUrl: string;
  matchRule: "extra" | "regexp" | "startWith";
  resType: "css-url" | "js-url" | "css-raw" | "js-raw";
  resValue: string;
};

function randomId() {
  const ts = Date.now().toString(16);
  const random = Math.random().toString(16).split(".")[1];
  return `${ts}-${random}`;
}
