import { useState, useEffect } from "react";
import { Button, Modal, Form, Input, List, message, Row, Col } from "antd";
import api from "../../../middlewares/tokenMiddleware";
import AddressSearch from "../../../components/Client/MapAPI";
const AddressCustomer = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [form] = Form.useForm();
  const getImagePath = (imageName) => {
    if (!imageName) return "";
    return new URL(`../../../assets/client/${imageName}`, import.meta.url).href;
  };
  // Fetch addresses when component mounts
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/get-address-by-id-customer`
        );
        if (response.data) {
          setAddresses(response.data.ShippingAddresses);
        } else {
          setAddresses([]);
        }
      } catch (error) {
        console.log(error.message);
        message.error("Lỗi khi tải danh sách địa chỉ");
      }
    };
    fetchAddresses();
  }, []);

  const openModal = (address = null) => {
    setCurrentAddress(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentAddress(null);
    form.resetFields();
  };

  const saveAddress = async (values) => {
    try {
      if (currentAddress) {
        await api.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/update-address?id=${
            currentAddress.id
          }`,
          { ...values }
        );
        setAddresses(
          addresses.map((addr) =>
            addr.id === currentAddress.id ? { ...addr, ...values } : addr
          )
        );
        message.success("Địa chỉ đã được cập nhật!");
      } else {
        console.log(values);
        const response = await api.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/create-address`,
          values
        );
        setAddresses([...addresses, response.data]);
        message.success("Địa chỉ đã được thêm!");
      }
      closeModal();
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi lưu địa chỉ");
    }
  };

  const deleteAddress = async (id) => {
    try {
      await api.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/delete-address?id=${id}`
      );
      setAddresses(addresses.filter((addr) => addr.id !== id));
      message.success("Địa chỉ đã bị xóa!");
    } catch {
      message.error("Lỗi khi xóa địa chỉ");
    }
  };

  return (
    <div className="px-6 pb-5 bg-gray-50 -mt-4 pt-3 rounded-md w-[870px]">
      <Row justify="space-between" align="middle">
        <Col>
          <h2 className="text-left font-bold text-xl">Danh sách địa chỉ</h2>
        </Col>
        <Col>
          <Button
            type="primary"
            onClick={() => openModal()}
            className="float-right  "
          >
            Thêm địa chỉ mới
          </Button>
        </Col>
      </Row>

      {addresses.length === 0 ? (
        <div className="text-center">
          <img
            src={getImagePath("delivery.png")}
            alt="noAddress"
            className="w-45 mx-auto"
          />
          <p className="text-gray-500 text-lg">Bạn chưa có địa chỉ nhận hàng</p>
        </div>
      ) : (
        <List
          bordered
          dataSource={addresses}
          renderItem={(address) => (
            <List.Item
              key={address.id}
              actions={[
                <Button
                  key="edit"
                  type="primary"
                  onClick={() => openModal(address)}
                >
                  Sửa
                </Button>,
                <Button
                  key="delete"
                  type="danger"
                  onClick={() => deleteAddress(address.id)}
                >
                  Xóa
                </Button>,
              ]}
              className="mt-4 rounded-lg shadow-md"
            >
              <div>
                <div className="font-semibold">
                  Người nhận: {address.RecipientName} | {address.PhoneNumber}
                </div>
                <div>{address.SpecificAddress}</div>
                <div>
                  {address.Address}
                </div>
              </div>
            </List.Item>
          )}
          className="mt-4"
        />
      )}

      {/* Modal for adding or editing address */}
      <Modal
        title={currentAddress ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnClose
        className=""
      >
        <Form
          form={form}
          initialValues={currentAddress}
          onFinish={saveAddress}
          layout="vertical"
        >
          <Form.Item
            label="Họ và Tên"
            name="RecipientName"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="PhoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: new RegExp(/^0\d{9,10}$/),
                message: "Số điện thoại không hợp lệ!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="Address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <AddressSearch form={form}/>
          </Form.Item>

          <Form.Item
            label="Địa chỉ cụ thể"
            name="SpecificAddress"
            rules={[
              { required: true, message: "Vui lòng nhập địa chỉ cụ thể!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item className="text-center">
            <Button type="default" onClick={closeModal} className="mr-4">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressCustomer;
