import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Elements } from "@stripe/react-stripe-js";
import * as apiClient from "../api-client";
import BookingForm from "../forms/bookingform/BookingForm";
import { useSearchContext } from "../contexts/SearchContext";
import BookingDetailsSummary from "../components/BookingDetailsSummary";
import { useAppContext } from "../contexts/AppContext";

const Booking = () => {
    const { stripePromise } = useAppContext();
    const search = useSearchContext();
    const { data: currentUser } = useQuery("fetchCurrentUser", apiClient.fetchCurrentUser);
    const { hotelId } = useParams();

    const [numberOfNights, setNumberOfNights] = useState<number>(0);

    useEffect(() => {
        if (search.checkIn && search.checkOut) {
            const nights = Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) / (1000 * 60 * 60 * 24);
            setNumberOfNights(Math.ceil(nights));
        }
    }, [search.checkIn, search.checkOut]);

    const { data: paymentIntentData } = useQuery("createPaymentIntent", () => apiClient.createPaymentIntent(hotelId as string, numberOfNights.toString()), {
        enabled: !!hotelId && numberOfNights > 0,
    });

    const { data: hotel } = useQuery("fetchHotelById", () =>
        apiClient.fetchHotelById(hotelId as string), { enabled: !!hotelId });

    if (!hotel) {
        return <></>
    }

    return (
        <div className="grid md:grid-cols-[1fr_2fr]">
            <BookingDetailsSummary
                checkIn={search.checkIn}
                checkOut={search.checkOut}
                adultCount={search.adultCount}
                childCount={search.childCount}
                numberOfNights={numberOfNights}
                hotel={hotel}
            />
            {currentUser && paymentIntentData && (
                <Elements stripe={stripePromise} options={{
                    clientSecret: paymentIntentData.clientSecret
                }}>
                    <BookingForm currentUser={currentUser} paymentIntent={paymentIntentData} />
                </Elements>
            )}
        </div>
    )
}

export default Booking;
