variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"  # 東京，離台灣最近
}

variable "bucket_name" {
  description = "S3 bucket name，全球唯一，自己取一個不重複的名字"
  type        = string
  default     = "marco-resume-2024"
}
