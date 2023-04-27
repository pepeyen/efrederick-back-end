import { Router } from "express";

// Services
import {
    EventService,
    RequestService,
    ResponseService,
    StringService,
} from "@services";

const router = Router();

//TODO Implement JWT middleware
router.get("/", (req, res) => {
    EventService.query({
        id: RequestService.queryParamToString(req.query.id),
        name: RequestService.queryParamToString(req.query.name),
        date: RequestService.queryParamToDate(req.query.date),
    })
        .then((response) => {
            res.status(200).json(
                ResponseService.generateSucessfulResponse(response)
            );
        })
        .catch((error) => {
            res.status(500).json(
                ResponseService.generateFailedResponse(error.message)
            );
        });
});

//TODO Implement JWT middleware
router.post("/", (req, res) => {
    const name = req.body.name;
    const orderIds = req.body.orderIds;

    if (!name) {
        res.status(400).json(
            ResponseService.generateFailedResponse("Invalid event data")
        );

        return;
    }

    EventService.save({
        name: name,
        orders: orderIds
            ? StringService.toObjectIds(orderIds as string[]) ?? []
            : [],
    })
        .then(() => {
            res.status(200).json(ResponseService.generateSucessfulResponse());
        })
        .catch((error) => {
            res.status(500).json(
                ResponseService.generateFailedResponse(error.message)
            );
        });
});

//TODO Implement JWT middleware
router.patch("/:id", (req, res) => {
    const id = req.params.id;
    const name = req.body.name;
    const orderIds = req.body.orderIds;
    const willAppendOrderIds = req.query.willAppendOrderIds;

    if (!id) {
        res.status(400).json(
            ResponseService.generateFailedResponse("Invalid event data")
        );

        return;
    }

    EventService.update(
        id,
        { name: name, orders: orderIds },
        RequestService.queryParamToBoolean(willAppendOrderIds)
    )
        .then((response) => {
            res.status(200).json(
                ResponseService.generateSucessfulResponse(response)
            );
        })
        .catch((error) => {
            res.status(500).json(
                ResponseService.generateFailedResponse(error.message)
            );
        });
});

//TODO Implement JWT middleware
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).json(
            ResponseService.generateFailedResponse("Invalid event data")
        );

        return;
    }

    EventService.delete(id)
        .then(() => {
            res.status(200).json(ResponseService.generateSucessfulResponse());
        })
        .catch((error) => {
            res.status(500).json(
                ResponseService.generateFailedResponse(error.message)
            );
        });
});

export default router;