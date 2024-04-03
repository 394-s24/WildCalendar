import React, { useState } from 'react';
import { Button, Modal, Form, DatePicker, Input } from 'antd';

const rangeConfig = {
    rules: [
        {
            type: 'array',
            required: true,
            message: 'Please enter a time!',
        },
    ],
}

const { RangePicker } = DatePicker;

const dateTimeFormat = "YYYY-MM-DD HH:mm:ss";

const AddEventButtonPopup = ({open, setOpen, onEventAdd}) => {

    //const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();

    const showModal = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setOpen(false);
    };

    const onClosingCompletely = () =>{
        form.resetFields();
    }

    const handleOk = (fieldsValue) => {
        let values = {
            'title': fieldsValue['title'],
            'start': fieldsValue['range-picker'][0].format(dateTimeFormat),
            'end': fieldsValue['range-picker'][1].format(dateTimeFormat),
            'description': (fieldsValue['description'] ? fieldsValue['description'] : "")
        };
        setOpen(false);
        console.log(values);
        onEventAdd(values);
    };
    return (
        <>
            <Button type="primary" size="large" onClick={showModal}>
                Create Event
            </Button>
            <Modal
                title="Create an Event"
                open={open}
                onOk={() => {form.validateFields().then(form.submit)}}
                onCancel={handleCancel}
                //afterOpenChange={onModalOpenChange}
                afterClose={onClosingCompletely}
            >
                <Form id="CreateEventForm" form={form} name="time_related_controls" onFinish={handleOk}>
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{
                            required: true,
                            message: "Title of the event cannot be empty!"
                        }]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item name="range-picker" label="Time" {...rangeConfig}>
                        <RangePicker 
                            {...rangeConfig} 
                            showTime 
                            format={dateTimeFormat}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};
export default AddEventButtonPopup;