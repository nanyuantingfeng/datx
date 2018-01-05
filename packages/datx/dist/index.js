"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Collection_1 = require("./Collection");
exports.Collection = Collection_1.Collection;
var Model_1 = require("./Model");
exports.Model = Model_1.Model;
var fields_1 = require("./helpers/model/fields");
exports.updateModelId = fields_1.updateModelId;
var init_1 = require("./helpers/model/init");
exports.initModelRef = init_1.initModelRef;
var utils_1 = require("./helpers/model/utils");
exports.assignModel = utils_1.assignModel;
exports.cloneModel = utils_1.cloneModel;
exports.getModelCollections = utils_1.getModelCollections;
exports.getModelId = utils_1.getModelId;
exports.getModelType = utils_1.getModelType;
exports.getOriginalModel = utils_1.getOriginalModel;
exports.modelToJSON = utils_1.modelToJSON;
exports.updateModel = utils_1.updateModel;
var ReferenceType_1 = require("./enums/ReferenceType");
exports.ReferenceType = ReferenceType_1.ReferenceType;
var setupModel_1 = require("./mixins/setupModel");
exports.setupModel = setupModel_1.setupModel;
var withActions_1 = require("./mixins/withActions");
exports.withActions = withActions_1.withActions;
var withMeta_1 = require("./mixins/withMeta");
exports.withMeta = withMeta_1.withMeta;
var prop_1 = require("./prop");
exports.prop = prop_1.default;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBd0M7QUFBaEMsa0NBQUEsVUFBVSxDQUFBO0FBQ2xCLGlDQUE4QjtBQUF0Qix3QkFBQSxLQUFLLENBQUE7QUFFYixpREFFZ0M7QUFEOUIsaUNBQUEsYUFBYSxDQUFBO0FBR2YsNkNBRThCO0FBRDVCLDhCQUFBLFlBQVksQ0FBQTtBQUdkLCtDQVMrQjtBQVI3Qiw4QkFBQSxXQUFXLENBQUE7QUFDWCw2QkFBQSxVQUFVLENBQUE7QUFDVixzQ0FBQSxtQkFBbUIsQ0FBQTtBQUNuQiw2QkFBQSxVQUFVLENBQUE7QUFDViwrQkFBQSxZQUFZLENBQUE7QUFDWixtQ0FBQSxnQkFBZ0IsQ0FBQTtBQUNoQiw4QkFBQSxXQUFXLENBQUE7QUFDWCw4QkFBQSxXQUFXLENBQUE7QUFPYix1REFBb0Q7QUFBNUMsd0NBQUEsYUFBYSxDQUFBO0FBRXJCLGtEQUErQztBQUF2QyxrQ0FBQSxVQUFVLENBQUE7QUFDbEIsb0RBQWlEO0FBQXpDLG9DQUFBLFdBQVcsQ0FBQTtBQUNuQiw4Q0FBMkM7QUFBbkMsOEJBQUEsUUFBUSxDQUFBO0FBRWhCLCtCQUEwQjtBQUVsQixlQUZELGNBQUksQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCB7Q29sbGVjdGlvbn0gZnJvbSAnLi9Db2xsZWN0aW9uJztcbmV4cG9ydCB7TW9kZWx9IGZyb20gJy4vTW9kZWwnO1xuXG5leHBvcnQge1xuICB1cGRhdGVNb2RlbElkLFxufSBmcm9tICcuL2hlbHBlcnMvbW9kZWwvZmllbGRzJztcblxuZXhwb3J0IHtcbiAgaW5pdE1vZGVsUmVmLFxufSBmcm9tICcuL2hlbHBlcnMvbW9kZWwvaW5pdCc7XG5cbmV4cG9ydCB7XG4gIGFzc2lnbk1vZGVsLFxuICBjbG9uZU1vZGVsLFxuICBnZXRNb2RlbENvbGxlY3Rpb25zLFxuICBnZXRNb2RlbElkLFxuICBnZXRNb2RlbFR5cGUsXG4gIGdldE9yaWdpbmFsTW9kZWwsXG4gIG1vZGVsVG9KU09OLFxuICB1cGRhdGVNb2RlbCxcbn0gZnJvbSAnLi9oZWxwZXJzL21vZGVsL3V0aWxzJztcblxuZXhwb3J0IHtJSWRlbnRpZmllcn0gZnJvbSAnLi9pbnRlcmZhY2VzL0lJZGVudGlmaWVyJztcbmV4cG9ydCB7SVJhd01vZGVsfSBmcm9tICcuL2ludGVyZmFjZXMvSVJhd01vZGVsJztcbmV4cG9ydCB7SVR5cGV9IGZyb20gJy4vaW50ZXJmYWNlcy9JVHlwZSc7XG5cbmV4cG9ydCB7UmVmZXJlbmNlVHlwZX0gZnJvbSAnLi9lbnVtcy9SZWZlcmVuY2VUeXBlJztcblxuZXhwb3J0IHtzZXR1cE1vZGVsfSBmcm9tICcuL21peGlucy9zZXR1cE1vZGVsJztcbmV4cG9ydCB7d2l0aEFjdGlvbnN9IGZyb20gJy4vbWl4aW5zL3dpdGhBY3Rpb25zJztcbmV4cG9ydCB7d2l0aE1ldGF9IGZyb20gJy4vbWl4aW5zL3dpdGhNZXRhJztcblxuaW1wb3J0IHByb3AgZnJvbSAnLi9wcm9wJztcblxuZXhwb3J0IHtwcm9wfTtcbiJdfQ==