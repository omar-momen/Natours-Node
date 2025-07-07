class APIFeatures {
  constructor(mongo_query, reqQuery) {
    this.mongo_query = mongo_query;
    this.reqQuery = reqQuery;
  }

  filter() {
    const queryObj = { ...this.reqQuery };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    
    this.mongo_query = this.mongo_query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.reqQuery.sort) {
      const sortBy = this.reqQuery.sort.split(',').join(' ');
      this.mongo_query = this.mongo_query.sort(sortBy);
    } else {
      this.mongo_query = this.mongo_query.sort('-createdAt');
    }

    return this;
  }

  limitingFields() {
    if (this.reqQuery.fields) {
      const fields = this.reqQuery.fields.split(',').join(' ');
      this.mongo_query = this.mongo_query.select(fields);
    } else {
      this.mongo_query = this.mongo_query.select('-__v');
    }

    return this;
  }

  paginate() {
    const page = +this.reqQuery.page || 1;
    const limit = +this.reqQuery.limit || 10;
    const skip = (page - 1) * limit;
    this.mongo_query = this.mongo_query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
