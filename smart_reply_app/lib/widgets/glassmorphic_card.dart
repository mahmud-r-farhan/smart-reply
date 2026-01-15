import 'package:flutter/material.dart';
import 'dart:ui';
import '../utils/app_theme.dart';

class GlassmorphicCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final BorderRadius? borderRadius;
  final double blur;
  final double opacity;

  const GlassmorphicCard({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius,
    this.blur = 10.0,
    this.opacity = 0.5,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: borderRadius ?? BorderRadius.circular(24),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
        child: Container(
          padding: padding ?? const EdgeInsets.all(0),
          decoration: BoxDecoration(
            color: AppTheme.backgroundCard.withValues(alpha: opacity),
            borderRadius: borderRadius ?? BorderRadius.circular(24),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.1),
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 20,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }
}
