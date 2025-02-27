"use client";
import React, { useState } from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Checkbox,
    DatePicker,
    Button,
    message,
} from "antd";

interface AdoptionFormProps {
    petId: number;
    userId: string;
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => void; // Handle form submission
}

const AdoptionFormModal: React.FC<AdoptionFormProps> = ({
    petId,
    userId,
    visible,
    onClose,
    onSubmit,
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // Combine additional fields
            const formData = {
                user_id: userId,
                pet_id: petId,
                ...values,
            };
            // Call the API to save the application
            const response = await fetch('/api/adoption_application', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                message.success('adoption form submitted successfully!');
                onSubmit(result); // Notify parent component
                form.resetFields();
                onClose();
            } else {
                const error = await response.json();
                message.error(error.message || 'Failed to submit form');
            }
        } catch (err) {
            message.error('Please complete all required fields!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Adoption Form"
            visible={visible}
            onCancel={onClose}
            footer={[
                <button
                    key="cancel"
                    onClick={onClose}
                    className="px-5 py-2 text-primary rounded-3xl font-semibold border border-primary bg-white transition-colors duration-200"
                >
                    Cancel
                </button>,
                <button
                    key="submit"
                    onClick={handleFormSubmit}
                    className="px-5 py-2 bg-primary text-white rounded-3xl font-semibold border border-primary transition-colors duration-200 ml-4"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            ]}>

            <Form form={form} layout="vertical">
                <Form.Item
                    label="Adopter Name"
                    name="adopter_name"
                    rules={[
                        { required: true, message: "Please enter your name!" },
                    ]}>
                    <Input placeholder="Enter your full name" />
                </Form.Item>

                <Form.Item
                    label="Adopter Address"
                    name="adopter_address"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your address!",
                        },
                    ]}>
                    <Input.TextArea placeholder="Enter your address" rows={2} />
                </Form.Item>

                <Form.Item
                    label="Age of Youngest Child"
                    name="age_of_youngest_child"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (value === null || value === undefined || /^[0-9]+$/.test(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Please enter a valid integer'));
                            },
                        },
                    ]}
                >
                    <Input placeholder="Enter age of youngest child" />
                </Form.Item>

                <Form.Item label="Other Pets Details" name="other_pets_details">
                    <Input.TextArea
                        placeholder="Details about other pets, if any"
                        rows={2}
                    />
                </Form.Item>

                <Form.Item
                    label="Are Other Pets Neutered?"
                    name="other_pets_neutered"
                    valuePropName="checked">
                    <Checkbox>Yes</Checkbox>
                </Form.Item>

                <Form.Item
                    label="Has Secure Outdoor Area?"
                    name="has_secure_outdoor_area"
                    valuePropName="checked">
                    <Checkbox>Yes</Checkbox>
                </Form.Item>

                <Form.Item
                    label="Where Will the Pet Sleep?"
                    name="pet_sleep_location">
                    <Input placeholder="e.g., Indoors, Doghouse, etc." />
                </Form.Item>

                <Form.Item
                    label="How Long Will the Pet Be Left Alone?"
                    name="pet_left_alone">
                    <Input placeholder="e.g., 2 hours, Not at all, etc." />
                </Form.Item>

                <Form.Item label="Additional Details" name="additional_details">
                    <Input.TextArea
                        placeholder="Any other relevant information"
                        rows={3}
                    />
                </Form.Item>

                <Form.Item
                    name="agree_to_terms"
                    valuePropName="checked"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject('You must agree to the terms'),
                        },
                    ]}
                >
                    <div className="mt-1 p-4 bg-gray-50 rounded-lg">
                        <Checkbox>
                            I agree to the{' '}
                            <span className="text-primary font-medium">Terms and Conditions</span>
                        </Checkbox>

                        <div className="mt-3 text-sm text-gray-600">
                            <p className="mb-2">By submitting this form, I agree to:</p>
                            <ul className="list-disc pl-4 space-y-2">
                                <li>Provide a safe and loving environment for the pet</li>
                                <li>Cover all necessary veterinary expenses</li>
                                <li>Never abandon or rehome the pet without consultation</li>
                                <li>Allow follow-up visits if required</li>
                                <li>Be responsible for the pet's well-being</li>
                            </ul>
                        </div>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AdoptionFormModal;
