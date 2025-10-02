// @import_dependencies
import { Request, Response } from "express";

// @import_services
import { ProgramsService } from "@app/domains/programs/programService";

// @import_models
import {} from "@app/models";

// @import_utilities
import { responseUtility } from "@core/utilities/responseUtility";

// @import_types

class ProgramsController {
  private service = new ProgramsService();

  constructor() {}

  public list = async (req: Request, res: Response) => {
    const _params = req._data();
    const response = await this.service.list(_params);
    return responseUtility.build(res, response);
  };
}

export const programsController = new ProgramsController();
export { ProgramsController };
