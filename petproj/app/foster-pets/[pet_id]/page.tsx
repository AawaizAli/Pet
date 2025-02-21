"use client";

import React, { useState, useEffect } from "react";
import { Carousel, Spin, Card, Tag, Divider, Button } from "antd";
import { PetWithImages } from "../../types/petWithImages";
import Navbar from "../../../components/navbar";
import FosterFormModal from "@/components/FosterFormModal";

const PetDetailsPage: React.FC<{ params: { pet_id: string } }> = ({
    params,
}) => {
    const { pet_id } = params;
    const [pet, setPet] = useState<PetWithImages | null>(null);
    const [carouselImages, setCarouselImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const userString = localStorage.getItem("user");
    if (!userString) {
      setError("User data not found in local storage");
      setLoading(false);
      return;
    }

    // Parse the user object to extract the user ID
    const user = JSON.parse(userString);
    const user_id = user?.id;
    console.log("user_id: ",user_id);
    if (!user_id) {
      setError("User ID is missing from the user object");
      setLoading(false);
      return;
    }


    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const res = await fetch(`/api/foster-pets/${pet_id}`);
                if (!res.ok) throw new Error("Pet not found");

                const petData = await res.json();
                setPet(petData);

                const images = [
                    petData.profile_image_url,
                    ...petData.additional_images.map(
                        (image: { image_url: string }) => image.image_url
                    ),
                ]
                    .filter(Boolean)
                    .slice(0, 5);
                setCarouselImages(images);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (pet_id) fetchPetDetails();
    }, [pet_id]);

    const handleAdoptClick = () => setIsModalVisible(true);
    const handleModalClose = () => setIsModalVisible(false);
    const handleFormSubmit = (formData: any) => {
        console.log("Adoption form data submitted:", formData);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-lg font-semibold">
                    Pet details not available.
                </h2>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="pet-details min-h-screen bg-gray-50 py-10 px-6">
                <Card className="shadow-lg rounded-md mx-auto max-w-4xl bg-white">
                    <h1 className="text-center text-3xl font-bold mb-4">
                        {pet.pet_name}
                    </h1>
                    <Carousel autoplay className="mb-8">
                        {carouselImages.map((image, index) => (
                            <div key={index}>
                                <img
                                    src={image || "/placeholder.jpg"}
                                    alt={`${pet.pet_name}-image-${index}`}
                                    className="w-full h-80 object-cover rounded-md"
                                />
                            </div>
                        ))}
                    </Carousel>

                    <div className="pet-info space-y-4">
                        <h2 className="text-xl font-semibold border-b pb-2">
                            Details
                        </h2>
                        <p>
                            <strong>Breed:</strong> {pet.pet_breed}
                        </p>
                        <p>
                            <strong>Age:</strong> {pet.age}{" "}
                            {pet.age > 1 ? "years" : "year"}
                        </p>
                        <p>
                            <strong>Location:</strong> {pet.city} - {pet.area}
                        </p>
                        <p>
                            <strong>Description:</strong>{" "}
                            {pet.description || "No description provided."}
                        </p>
                        <strong>Status:</strong>{" "}
                        <Tag
                            color={
                                pet.adoption_status === "Available"
                                    ? "green"
                                    : "red"
                            }>
                            {pet.adoption_status}
                        </Tag>
                        <p>
                            <strong>Foster Price:</strong>{" "}
                            {pet.price ? `PKR ${pet.price}` : "Not listed"}
                        </p>
                        <Divider />
                        <h2 className="text-xl font-semibold border-b pb-2">
                            Additional Info
                        </h2>
                        <p>
                            <strong>Vaccinated:</strong>{" "}
                            {pet.vaccinated ? "Yes" : "No"}
                        </p>
                        <p>
                            <strong>Neutered:</strong>{" "}
                            {pet.neutered ? "Yes" : "No"}
                        </p>
                        <p>
                            <strong>Energy Level:</strong>{" "}
                            {pet.energy_level || "N/A"}
                        </p>
                        <p>
                            <strong>Cuddliness Level:</strong>{" "}
                            {pet.cuddliness_level || "N/A"}
                        </p>
                        <p>
                            <strong>Can live with dogs:</strong>{" "}
                            {pet.can_live_with_dogs ? "Yes" : "No"}
                        </p>
                        <p>
                            <strong>Can live with cats:</strong>{" "}
                            {pet.can_live_with_cats ? "Yes" : "No"}
                        </p>
                        <p>
                            <strong>Must have someone home:</strong>{" "}
                            {pet.must_have_someone_home ? "Yes" : "No"}
                        </p>
                    </div>

                    <div className="text-center mt-6">
                        <div
                            onClick={handleAdoptClick}
                            className="bg-primary text-white px-4 py-2 rounded-xl font-semibold border border-white hover:border-primary hover:bg-[#ffffff] hover:text-primary cursor-pointer">
                            Foster Now!
                        </div>
                    </div>
                </Card>
            </div>

            <FosterFormModal
                petId={parseInt(pet_id)}
                userId={user_id}
                visible={isModalVisible}
                onClose={handleModalClose}
                onSubmit={handleFormSubmit}
            />
        </>
    );
};

export default PetDetailsPage;
