terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# ── S3 Bucket：存放靜態檔案 ────────────────────────────────────────────────
resource "aws_s3_bucket" "resume" {
  bucket = var.bucket_name
}

# 開啟靜態網站模式，讓 S3 能直接當 web server
resource "aws_s3_bucket_website_configuration" "resume" {
  bucket = aws_s3_bucket.resume.id

  index_document {
    suffix = "index.html"
  }
}

# 允許公開讀取（靜態網站必須）
resource "aws_s3_bucket_public_access_block" "resume" {
  bucket = aws_s3_bucket.resume.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "resume" {
  bucket = aws_s3_bucket.resume.id
  depends_on = [aws_s3_bucket_public_access_block.resume]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "PublicRead"
      Effect    = "Allow"
      Principal = "*"
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.resume.arn}/*"
    }]
  })
}

# ── CloudFront：全球 CDN，加速網站載入 ───────────────────────────────────────
resource "aws_cloudfront_distribution" "resume" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100"  # 只用美洲+歐洲節點，最便宜

  origin {
    domain_name = aws_s3_bucket_website_configuration.resume.website_endpoint
    origin_id   = "S3-${var.bucket_name}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id       = "S3-${var.bucket_name}"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    min_ttl     = 0
    default_ttl = 3600   # 快取 1 小時
    max_ttl     = 86400  # 最多 24 小時
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = true  # 用 CloudFront 預設的 HTTPS 憑證
  }
}
