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

variable "ssh_public_key_path" {
  description = "本機 SSH 公鑰路徑，用來 SSH 進 VM"
  type        = string
  default     = "~/.ssh/id_rsa.pub"
}

variable "ami_id" {
  description = "EC2 AMI：東京區的 Ubuntu 24.04 LTS"
  type        = string
  default     = "ami-0d52744d6551d851e"  # ap-northeast-1 Ubuntu 24.04
}
