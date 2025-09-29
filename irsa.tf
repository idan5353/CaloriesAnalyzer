resource "aws_iam_role" "bedrock_role" {
  name = "bedrock-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Federated = module.eks.oidc_provider_arn
        }
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            "${replace(module.eks.cluster_oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:default:bedrock-sa"
          }
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "bedrock_policy" {
  role       = aws_iam_role.bedrock_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonBedrockFullAccess"
}

resource "kubernetes_service_account" "bedrock_sa" {
  metadata {
    name = "bedrock-sa"
    annotations = {
      "eks.amazonaws.com/role-arn" = aws_iam_role.bedrock_role.arn
    }
  }
  depends_on = [module.eks]
}
