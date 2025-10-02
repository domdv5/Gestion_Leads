import mongoose_delete from "mongoose-delete";
import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

export interface ILead {
  _id: Types.ObjectId;
  incremental: number;
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  mobile_phone: string;
  interestProgram: Types.ObjectId;
  status: "active" | "inactive";
  trackings: {
    tracking: Types.ObjectId;
    description: string;
  }[];
  created_at: Date;
  updated_at: Date;
  deleted: boolean;
  deletedAt: Date;
}

const LeadSchema = new Schema(
  {
    incremental: {
      // numero unico de 4 digitos
      type: Schema.Types.Number,
    },
    full_name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    first_name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    last_name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    email: {
      type: Schema.Types.String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile_phone: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    interestProgram: {
      type: Schema.Types.ObjectId,
      ref: "Program",
      required: true,
    },
    status: {
      type: Schema.Types.String,
      enum: ["active", "inactive"],
      default: "active",
    },
    trackings: [
      {
        tracking: {
          type: Schema.Types.ObjectId,
          ref: "Tracking",
          required: true,
        },
        description: {
          type: Schema.Types.String,
          required: true,
          trim: true,
        },
      },
    ],
  },
  {
    collection: "leads",
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

LeadSchema.plugin(mongoose_delete, {
  deletedAt: true,
  overrideMethods: "all",
  indexFields: "all",
});

export const LeadModel = mongoose.model<ILead, any>("Lead", LeadSchema);
