import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const addressSchema = new Schema(
    {
        addressLine: {
            street: {
                type: String,
                required: true,
                            },
            houseNumber: {
                type: String,
                required: true
            },
            apartmentNumber: {
                type: String,
                required: false
            },
            locality: {
                type: String,
                required: true,
                            },
            district: {
                type: String,
                required: true,
                            },
            city: {
                type: String,
                required: true,
                            },
            pincode: {
                type: String, // Changed to String to avoid issues with leading zeros
                required: true,
                validate: {
                    validator: function (v) {
                        return /^[1-9][0-9]{5}$/.test(v); // Validate 6-digit pin codes
                    },
                    message: (props) => `${props.value} is not a valid pincode!`,
                }
            }
        },
        state: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String, // Changed to String for better handling
            required: true,
            validate: {
                validator: function (v) {
                    return /^[6-9]\d{9}$/.test(v); // Validate 10-digit Indian phone numbers
                },
                message: (props) => `${props.value} is not a valid phone number!`
            }
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

addressSchema.plugin(mongooseAggregatePaginate);

export const Address = mongoose.model("Address", addressSchema);
