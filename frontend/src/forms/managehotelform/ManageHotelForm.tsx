import { useForm, FormProvider } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestSection from "./GuestSection";
import { useEffect } from "react";
import ImageSection from "./ImageSection";
import { HotelType } from "../../../../backend/src/shared/types";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    adultCount: number;
    childCount: number;
    facilities: string[];
    starRating: number;
    pricePerNight: number;
    imageFiles: FileList;
    imageUrls: string[]
}

type Props = {
    onSave: (hotelFormData: FormData) => void,
    isLoading: boolean,
    hotel?: HotelType
}

const ManageHotelForm = ({ onSave, isLoading, hotel }: Props) => {
    const formMethods = useForm<HotelFormData>();
    const { handleSubmit, reset } = formMethods;

    useEffect(() => {
        reset(hotel)
    }, [hotel, reset]);

    const onSubmit = handleSubmit((formDataJson: HotelFormData) => {
        const formData = new FormData();
        if (hotel) {
            formData.append("hotelId", hotel._id);
        }
        formData.append("name", formDataJson.name);
        formData.append("adultCount", formDataJson.adultCount.toString());
        formData.append("childCount", formDataJson.childCount.toString());
        formData.append("city", formDataJson.city);
        formData.append("country", formDataJson.country);
        formData.append("description", formDataJson.description);
        formData.append("type", formDataJson.type);
        formData.append("starRating", formDataJson.starRating.toString());
        formData.append("pricePerNight", formDataJson.pricePerNight.toString());
        formDataJson.facilities.forEach((facility, index) => {
            formData.append(`facilities[${index}]`, facility);
        });

        if (formDataJson.imageUrls) {
            formDataJson.imageUrls.forEach((url, index) => {
                formData.append(`imageUrls[${index}]`, url);
            });
        }
        Array.from(formDataJson.imageFiles).forEach((image) => {
            formData.append("imageFiles", image);
        });
        onSave(formData);
    });
    return (
        <FormProvider {...formMethods}>
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <DetailsSection />
                <TypeSection />
                <FacilitiesSection />
                <GuestSection />
                <ImageSection />
                <span className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl disabled:bg-gray-500"
                        disabled={isLoading}
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </button>
                </span>
            </form>
        </FormProvider>
    )
}

export default ManageHotelForm;
