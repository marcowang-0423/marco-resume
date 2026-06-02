output "s3_website_url" {
  description = "S3 靜態網站 URL（沒有 CDN）"
  value       = "http://${aws_s3_bucket_website_configuration.resume.website_endpoint}"
}

output "cloudfront_url" {
  description = "CloudFront CDN URL（正式使用這個）"
  value       = "https://${aws_cloudfront_distribution.resume.domain_name}"
}
