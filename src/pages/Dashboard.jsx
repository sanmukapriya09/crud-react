import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { Select, Form, Input, Button, Table } from "antd";

const tableHeaders = [
  "id",
  "firstName",
  "lastName",
  "age",
  "gender",
  "email",
  "phone",
];

const Dashboard = () => {
  const [httpMethod, setHttpMethod] = useState("");
  const [data, setData] = useState([]);

  const columns = tableHeaders.map((header) => ({
    title: header,
    dataIndex: header,
    key: header,
  }));

  const getRequiredUserFields = (user) => {
    const obj = {};
    tableHeaders.forEach((header) => {
      obj[header] = user[header];
    });
    return obj;
  };

  const onFinish = async (values) => {
    let res;

    try {
      switch (httpMethod) {
        case "GET":
          res = await axiosInstance.get("/users");
          setData(res.data.users.map(getRequiredUserFields));
          break;

        case "POST":
          res = await axiosInstance.post("/users/add", values);
          setData([getRequiredUserFields(res.data)]);
          break;

        case "PUT":
          res = await axiosInstance.put(`/users/${values.id}`, values);
          setData([getRequiredUserFields(res.data)]);
          break;

        case "DELETE":
          res = await axiosInstance.delete(`/users/${values.id}`);
          setData([{ id: values.id, firstName: "Deleted" }]);
          break;

        default:
          break;
      }
    } catch (err) {
      console.error("Operation failed:", err);
      alert("Operation failed");
    }
  };

  return (
    <div
      style={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Dashboard Page</h2>

      <Select
        style={{ width: 200, marginBottom: 20 }}
        placeholder="Select HTTP Method"
        value={httpMethod || undefined}
        onChange={(value) => {
          setHttpMethod(value);
          setData([]);
        }}
      >
        <Option value="GET">GET</Option>
        <Option value="POST">POST</Option>
        <Option value="PUT">PUT</Option>
        <Option value="DELETE">DELETE</Option>
      </Select>

      {httpMethod && (
        <Form layout="vertical" onFinish={onFinish}>
          {(httpMethod === "PUT" || httpMethod === "DELETE") && (
            <Form.Item label="User ID" name="id" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          )}

          {(httpMethod === "POST" || httpMethod === "PUT") && (
            <>
              <Form.Item label="First Name" name="firstName">
                <Input />
              </Form.Item>

              <Form.Item label="Last Name" name="lastName">
                <Input />
              </Form.Item>

              <Form.Item label="Age" name="age">
                <Input />
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input />
              </Form.Item>

              <Form.Item label="Phone" name="phone">
                <Input />
              </Form.Item>
            </>
          )}

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      )}

      {/* Table */}
      {data.length > 0 && (
        <Table
          style={{ marginTop: 30 }}
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={false}
        />
      )}
    </div>
  );
};

export default Dashboard;