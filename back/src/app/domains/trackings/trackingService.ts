// @import_dependencies

// @import_services

// @import_models
import { Third, Tracking } from "@app/models";

// @import_utilities
import { responseUtility } from "@core/utilities/responseUtility";
import moment from "moment";

// @import_types

class TrackingService {
  constructor() {}

  public async list(_params) {
    try {
      const where: any = {};

      let third;

      if (_params.user) {
        third = await Third.findOne({ user: _params.user }).lean();
        if (third) where.adviser = third._id.toString();
      }

      let trackings = await Tracking.find(where)
        .sort({ created_at: -1 })
        .limit(100)
        .lean();

      return responseUtility.success({
        list: trackings,
      });
    } catch (error) {
      console.log("error", error);
    }
  }
}

export const trackingService = new TrackingService();
export { TrackingService };
