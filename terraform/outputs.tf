output "s3_website_url" {
  description = "S3 靜態網站 URL（沒有 CDN）"
  value       = "http://${aws_s3_bucket_website_configuration.resume.website_endpoint}"
}

output "cloudfront_url" {
  description = "CloudFront CDN URL（正式使用這個）"
  value       = "https://${aws_cloudfront_distribution.resume.domain_name}"
}

output "vm_public_ip" {
  description = "EC2 VM 的公開 IP，apply 完就能 SSH 進去"
  value       = aws_instance.resume_vm.public_ip
}

output "vm_ssh_command" {
  description = "SSH 登入指令"
  value       = "ssh ubuntu@${aws_instance.resume_vm.public_ip}"
}

output "website_url" {
  description = "網站網址（K3s 部署完後）"
  value       = "http://${aws_instance.resume_vm.public_ip}"
}
