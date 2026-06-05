
# ── SSH Key Pair：用你本機的公鑰登入 VM ───────────────────────────────────────
resource "aws_key_pair" "resume" {
  key_name   = "marco-resume-key"
  public_key = file(var.ssh_public_key_path)
}

# ── Security Group：開放必要的 port ──────────────────────────────────────────
resource "aws_security_group" "resume_vm" {
  name        = "marco-resume-sg"
  description = "Allow SSH, HTTP, HTTPS, K3s API"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTP（網站）"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ── EC2 Instance：t2.micro = AWS 免費方案（12個月）────────────────────────────
resource "aws_instance" "resume_vm" {
  ami                    = var.ami_id
  instance_type          = "t2.micro"
  key_name               = aws_key_pair.resume.key_name
  vpc_security_group_ids = [aws_security_group.resume_vm.id]

  # VM 啟動時自動安裝 K3s + 部署網站
  user_data = file("${path.module}/setup-k3s.sh")

  tags = {
    Name = "marco-resume-vm"
  }
}
