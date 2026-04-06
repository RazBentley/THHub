"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suggestWorkout = exports.lookupFoodNutrition = exports.onNewMessage = exports.handleStripeWebhook = exports.createPaymentIntent = exports.sendCheckInNotifications = void 0;
const admin = require("firebase-admin");
admin.initializeApp();
var notifications_1 = require("./notifications");
Object.defineProperty(exports, "sendCheckInNotifications", { enumerable: true, get: function () { return notifications_1.sendCheckInNotifications; } });
var payments_1 = require("./payments");
Object.defineProperty(exports, "createPaymentIntent", { enumerable: true, get: function () { return payments_1.createPaymentIntent; } });
Object.defineProperty(exports, "handleStripeWebhook", { enumerable: true, get: function () { return payments_1.handleStripeWebhook; } });
var messageNotifications_1 = require("./messageNotifications");
Object.defineProperty(exports, "onNewMessage", { enumerable: true, get: function () { return messageNotifications_1.onNewMessage; } });
var ai_1 = require("./ai");
Object.defineProperty(exports, "lookupFoodNutrition", { enumerable: true, get: function () { return ai_1.lookupFoodNutrition; } });
Object.defineProperty(exports, "suggestWorkout", { enumerable: true, get: function () { return ai_1.suggestWorkout; } });
//# sourceMappingURL=index.js.map