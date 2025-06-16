const UrlSchema = new mongoose.Schema({
  title: String,
  url: String,
  owner: String, // Owner's email
  createdAt: { type: Date, default: Date.now },
});

const UrlModel = mongoose.models.Url || mongoose.model("Url", UrlSchema);

export default UrlModel;
