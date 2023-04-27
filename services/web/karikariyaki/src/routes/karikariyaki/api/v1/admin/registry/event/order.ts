import { Router } from "express";

// Services
import { OrderService, RequestService, ResponseService } from "@services";

const router = Router();

//TODO Implement JWT middleware
router.get("/", (req, res) => {
    OrderService.query({
        id: RequestService.queryParamToString(req.query.id),
        event: RequestService.queryParamToString(req.query.eventId),
        status: RequestService.queryParamToString(req.query.status),
        operator: RequestService.queryParamToString(req.query.operatorId),
        client: RequestService.queryParamToString(req.query.clientName),
        item: RequestService.queryParamToString(req.query.itemId),
        variant: RequestService.queryParamToString(req.query.variantId),
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
    const event = req.body.eventId;
    const operator = req.body.operatorId;
    const client = req.body.clientName;
    const item = req.body.itemId;

    // Non obligatory params
    const status = req.body.status;
    const variant = req.body.variantId;

    if (!event || !operator || !client || !item) {
        res.status(400).json(
            ResponseService.generateFailedResponse("Invalid order data")
        );

        return;
    }

    OrderService.save({
        event: RequestService.queryParamToString(event),
        status: RequestService.queryParamToString(status),
        operator: RequestService.queryParamToString(operator),
        client: RequestService.queryParamToString(client),
        item: RequestService.queryParamToString(item),
        variant: RequestService.queryParamToString(variant),
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
    const status = req.body.status;

    if (!id) {
        res.status(400).json(
            ResponseService.generateFailedResponse("Invalid order data")
        );

        return;
    }

    OrderService.update(id, {
        status: RequestService.queryParamToString(status),
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
router.delete("/:id", (req, res) => {
    const id = req.params.id;

    if (!id) {
        res.status(400).json(
            ResponseService.generateFailedResponse("Invalid order data")
        );

        return;
    }

    OrderService.delete(id)
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
