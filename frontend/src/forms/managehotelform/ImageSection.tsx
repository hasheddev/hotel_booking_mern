import { useFormContext } from "react-hook-form";
import { type HotelFormData } from "./ManageHotelForm";

const ImageSection = () => {
    const { register, formState: { errors } } = useFormContext<HotelFormData>();
    return (
        <div>
            <h2 className="text-2xl font-bold mb-3">Images</h2>
            <div className="border rounded p-4 flex flex-col gap-4">
                <input type="file"
                    multiple
                    accept="image/*"
                    className="w-full text-gray-700 font-normal"
                    {...register("imageFiles", {
                        validate: (imageFiles) => {
                            const length = imageFiles.length;
                            if (length === 0) {
                                return "Al least one image should be added";
                            }
                            if (length > 6) {
                                return "Images cannot be more than 6";
                            }
                            return true;
                        }
                    })} />
            </div>
            {errors.imageFiles && (<span
                className="text-red-500 text-sm font-bold">
                {errors.imageFiles.message}
            </span>)}
        </div>
    )
}

export default ImageSection;
