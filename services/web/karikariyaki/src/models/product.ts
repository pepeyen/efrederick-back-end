import { Schema, model } from "mongoose";

// Types
import { Statics } from "@types";

// Models
import { VariantModel } from "@models";

// Services
import { DatabaseService, StringService } from "@services";

const validateProductName = async (name: string) => {
    if (
        StringService.isStringInsideBoundaries(
            name,
            Statics.PRODUCT_NAME_MIN_LENGTH,
            Statics.PRODUCT_NAME_MAX_LENGTH
        ) === false
    ) {
        if (name.trim().length < Statics.PRODUCT_NAME_MIN_LENGTH) {
            throw Error(
                `Product name is shorter ${Statics.PRODUCT_NAME_MIN_LENGTH} than characters`
            );
        }

        throw Error(
            `Product name is longer than ${Statics.PRODUCT_NAME_MAX_LENGTH} characters`
        );
    }

    const entry = await ProductModel.findOne({
        name: DatabaseService.generateCaseInsensivitySettings(name),
    });

    if (entry) {
        throw Error("Product name is duplicated");
    }
};

const validateProductVariants = async (variantIds: Schema.Types.ObjectId[]) => {
    for (const variantId of variantIds) {
        const convertedVariantId = variantId.toString().trim();
        const foundVariant = await VariantModel.findById(convertedVariantId);

        if (!foundVariant) {
            throw Error("Product variant ID is invalid");
        }

        const foundVariantIds = [
            variantIds.find(
                (_) =>
                    _.toString().trim().toLowerCase().replace(" ", "") ===
                    convertedVariantId.toLowerCase().replace(" ", "")
            ),
        ];

        if (foundVariantIds.length >= 1) {
            throw Error("Product variant is duplicated");
        }
    }
};

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        validate: validateProductName,
    },
    variants: {
        type: [{ type: Schema.Types.ObjectId, ref: VariantModel }],
        default: [],
        validate: validateProductVariants,
    },
});

const ProductModel = model("products", ProductSchema);

export default ProductModel;
