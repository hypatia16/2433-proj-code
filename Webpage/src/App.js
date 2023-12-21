import './App.css';
import { useState } from 'react';
import { CalculatorFilled } from '@ant-design/icons';
import type { MenuProps,DescriptionsProps } from 'antd';
import { Button, Divider, Dropdown, Result, Select, Input, InputNumber, Space, Descriptions, Modal, Image } from 'antd';

export default function Form() {

  //Create New Clients
  const [clients, setClients] = useState({
    name: "",
    profile: {
      age: "",
      sex: "",
      region: "",
      bmi: "",
      children: "",
      smoker: "",
    },
  });

  //Create New Result returning
  const [result, setResult] = useState('');


  //Define Function for Changing Clients Profile
  function ChangeName(e) {
    setClients({
      ...clients,
      name: e.target.value,
    });
  }
  const ChangeAge = (value: number) => {
    setClients({
      ...clients,
      profile: {
        ...clients.profile,
        age: `${value}`,
      },
    });
  };
  const ChangeSex = (value: string) => {
    setClients({
      ...clients,
      profile: {
        ...clients.profile,
        sex: `${value}`,
      },
    });
  };
  const ChangeRegion = (value: string) => {
    setClients({
      ...clients,
      profile: {
        ...clients.profile,
        region: `${value}`,
      },
    });
  };
  const ChangeBMI = (value: number) => {
    setClients({
      ...clients,
      profile: {
        ...clients.profile,
        bmi: `${value}`,
      },
    });
  };
  const ChangeChildren = (value: number) => {
    setClients({
      ...clients,
      profile: {
        ...clients.profile,
        children: `${value}`,
      },
    });
  };
  const ChangeSomker = (value: string) => {
    setClients({
      ...clients,
      profile: {
        ...clients.profile,
        smoker: `${value}`,
      },
    });
  };

  //Define Desciption Part Infomation
  const info: DescriptionsProps['info'] = [
    {
      key: '1',
      label: 'Name',
      children: clients.name,
    },
    {
      key: '2',
      label: 'Age',
      children: clients.profile.age,
    },
    {
      key: '3',
      label: 'Sex',
      children: clients.profile.sex,
    },
    {
      key: '4',
      label: 'Region',
      children: clients.profile.region,
    },
    {
      key: '5',
      label: 'BMI',
      children: clients.profile.bmi,
    },
    {
      key: '6',
      label: 'Number of Children',
      children: clients.profile.children,
    },
    {
      key: '7',
      label: 'smoker',
      children: clients.profile.smoker,
    },
  ];

  //Create onClick Button Function sending to Backend
  const submitForm = async () => {
    try {
      // Get Input Data from Clients
      const inputData = {
        age: clients.profile.age,
        bmi: clients.profile.bmi,
        children: clients.profile.children,
        region: clients.profile.region,
        sex: clients.profile.sex,
        smoker: clients.profile.smoker,
      };

      // Sending Post Request using fetch
      const response = await fetch('/add_record', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputData, null, 2),
      });

      // Check if the response is not OK (status code other than 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Attempt to parse the JSON response
      const responseData = await response.json();

      // Check if the response contains valid JSON data
      if (typeof responseData === 'undefined') {
        throw new Error('Unexpected end of JSON input');
      }

      // Update state or perform other actions based on the response
      setResult(`$${JSON.stringify(responseData)} USD`);
      } catch (error) {
        console.error('Error:', error.message);
      }
      showModal();
  };

  //Define Modal Part
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };


  //Return to HTML
  return (
    <>

    {/* Logo */}
    <div className="center-container">
    <Image
      width={200}
      src="logo.png"
      />
    </div>

    <br />
    <br />

    {/* First Two Box of Input, Name and Age */}
    <div className="center-container">
      <body>
        <Space>
        <Input style={{ width: 300 }}
          addonBefore="Name"
          defaultValue={clients.name}
          onChange={ChangeName}
          />

        <InputNumber style={{ width: 300 }}
          addonBefore="Age"
          defaultValue={clients.profile.age}
          onChange={ChangeAge}
          />

        </Space>

        <br />
        <br />

    {/* Second Two Box of Input, Sex and Region */}
        <Space>
        <Select
          defaultValue="Sex"
          style={{ width: 300 }}
          onChange={ChangeSex}
          options={[
            { value: "male", label: 'Male' },
            { value: "female", label: 'Female' },
          ]}
        />

        <Select
          defaultValue="Region"
          style={{ width: 300 }}
          onChange={ChangeRegion}
          options={[
            { value: "southwest", label: 'Southwest' },
            { value: "southeast", label: 'Southeast' },
            { value: "northwest", label: 'Northwest' },
            { value: "northeast", label: 'Northeast' },
          ]}
          />
          </Space>

          <br />
          <br />

    {/* Third Two Box of Input, BMI and Number of Children */}
        <Space>
        <InputNumber style={{ width: 300 }}
          addonBefore="BMI"
          defaultValue={clients.profile.bmi}
          onChange={ChangeBMI}
          />

        <InputNumber style={{ width: 300 }}
          addonBefore="Number of Chiildren"
          defaultValue={clients.profile.children}
          onChange={ChangeChildren}
        />
        </Space>

        <br />
        <br />

        {/* Last Box of Input, Smoker or Not */}
        <Select
          defaultValue="Are You a Smoker"
          style={{ width: 608 }}
          onChange={ChangeSomker}
          options={[
            { value: "yes", label: 'Yes' },
            { value: "no", label: 'No' },
          ]}
        />

        </body>
        </div>

        {/* Divider */}
        <Divider orientation="left" plain>
        Summary
        </Divider>

        {/* Descriptions */}
        <Descriptions title="" bordered items={info} />

        {/* Divider */}
        <Divider orientation="left" plain>
        Confirmation
        </Divider>

        {/* Double Check before Button Click */}
        <div className="center-container">
          <h5>
            If you believe Above Information is Correct
            <br />
            Please Click Submit Button below
          </h5>
        </div>

        <br />

        {/* Submit Button */}
        <div className="center-container">
        <Button
        type="primary"
        shape="round"
        icon={<CalculatorFilled />}
        size="big"
        onClick={submitForm}
        >
        Submit
        </Button>

        {/* PopUp Modal After Submit*/}
        <Modal title="Result" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p>Dear {clients.name}</p>
          <p>Here's Your Health Insurance Final Quote:</p>
          <p>{result}</p>
          </Modal>
        </div>
    </>
  );
}
