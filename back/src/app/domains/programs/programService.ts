// @import_dependencies

// @import_services

// @import_models
import { Third, Program } from "@app/models";

// @import_utilities
import { responseUtility } from "@core/utilities/responseUtility";
// @import_types

class ProgramsService {
  constructor() {}

  public async list(_params) {
    try {
      const where: any = {};

      let third;

      if (_params.user) {
        third = await Third.findOne({ user: _params.user }).lean();
        if (third) where.adviser = third._id.toString();
      }

      let programs = await Program.find(where)
        .sort({ created_at: -1 })
        .limit(100)
        .lean();

      return responseUtility.success({
        list: programs,
      });
    } catch (error) {
      console.log("error", error);
    }
  }
}

export const programsService = new ProgramsService();
export { ProgramsService };
