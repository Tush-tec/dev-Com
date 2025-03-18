import fs from "fs";
import mongoose from "mongoose";



export const filterObjectKeys = (fieldsArray, objectArray) => {
  const filteredArray = structuredClone(objectArray).map((originalObj) => {
    let obj = {};
    structuredClone(fieldsArray)?.forEach((field) => {
      if (field?.trim() in originalObj) {
        obj[field] = originalObj[field];
      }
    });
    if (Object.keys(obj).length > 0) return obj;
    return originalObj;
  });
  return filteredArray;
};

/**
 *
 * @param {any[]} dataArray
 * @param {number} page
 * @param {number} limit
 * @returns {{previousPage: string | null, currentPage: string, nextPage: string | null, data: any[]}}
 */
export const getPaginatedPayload = (dataArray, page, limit) => {
  const startPosition = +(page - 1) * limit;

  const totalItems = dataArray.length; // total documents present after applying search query
  const totalPages = Math.ceil(totalItems / limit);

  dataArray = structuredClone(dataArray).slice(
    startPosition,
    startPosition + limit
  );

  const payload = {
    page,
    limit,
    totalPages,
    previousPage: page > 1,
    nextPage: page < totalPages,
    totalItems,
    currentPageItems: dataArray?.length,
    data: dataArray,
  };
  return payload;
};

/**
 *
 * @param {import("express").Request} req
 * @param {string} fileName
 * @description returns the file's static path from where the server is serving the static image
 */
export const getStaticFilePath = (req, fileName) => {
  return `${req.protocol}://${req.get("host")}/images/${fileName}`;
};

/**
 *
 * @param {string} fileName
 * @description returns the file's local path in the file system to assist future removal
 */
export const getLocalPath = (fileName) => {
  return `public/images/${fileName}`;
};

/**
 *
 * @param {string} localPath
 * @description Removed the local file from the local file system based on the file path
 */


/**
 * @param {import("express").Request} req
 * @description **This utility function is responsible for removing unused image files due to the api fail**.
 *
 * **For example:**
 * * This can occur when product is created.
 * * In product creation process the images are getting uploaded before product gets created.
 * * Once images are uploaded and if there is an error creating a product, the uploaded images are unused.
 * * In such case, this function will remove those unused images.


/**
 *
 * @param {{page: number; limit: number; customLabels: mongoose.CustomLabels;}} options
 * @returns {mongoose.PaginateOptions}
 */
export const getMongoosePaginationOptions = ({
  page = 1,
  limit = 10,
  customLabels,
}) => {
  return {
    page: Math.max(page, 1),
    limit: Math.max(limit, 1),
    pagination: true,
    customLabels: {
      pagingCounter: "serialNumberStartFrom",
      ...customLabels,
    },
  };
};

/**
 * @param {number} max Ceil threshold (exclusive)
 */
export const getRandomNumber = (max) => {
  return Math.floor(Math.random() * max);
};