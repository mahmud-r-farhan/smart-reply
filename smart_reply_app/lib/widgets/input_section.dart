import 'package:flutter/material.dart';
import '../utils/app_theme.dart';
import '../utils/constants.dart';

class InputSection extends StatefulWidget {
  final String input;
  final String mode;
  final bool loading;
  final String? error;
  final Function(String) onInputChanged;
  final VoidCallback onSubmit;
  final VoidCallback onClear;

  const InputSection({
    super.key,
    required this.input,
    required this.mode,
    required this.loading,
    required this.error,
    required this.onInputChanged,
    required this.onSubmit,
    required this.onClear,
  });

  String get _placeholder {
    return mode == AppMode.reply
        ? 'What message did you receive?'
        : 'What do you want to enhance?';
  }

  String get _buttonText {
    if (loading) {
      return mode == AppMode.reply ? 'Generating...' : 'Enhancing...';
    }
    return mode == AppMode.reply ? 'Generate' : 'Enhance';
  }

  @override
  State<InputSection> createState() => _InputSectionState();
}

class _InputSectionState extends State<InputSection> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController(text: widget.input);
  }

  @override
  void didUpdateWidget(InputSection oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.input != widget.input) {
      _controller.text = widget.input;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Text Input Area
        Container(
          decoration: BoxDecoration(
            color: AppTheme.backgroundLight.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: AppTheme.borderColor.withValues(alpha: 0.5),
            ),
          ),
          child: Column(
            children: [
              TextField(
                controller: _controller,
                onChanged: widget.onInputChanged,
                maxLines: 5,
                minLines: 4,
                maxLength: 2000,
                style: const TextStyle(
                  color: AppTheme.textPrimary,
                  fontSize: 15,
                  height: 1.6,
                  fontWeight: FontWeight.w500,
                ),
                decoration: InputDecoration(
                  hintText: widget._placeholder,
                  hintStyle: TextStyle(
                    color: AppTheme.textMuted.withValues(alpha: 0.6),
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.all(16),
                  counterText: '',
                ),
              ),
              // Character count
              Padding(
                padding: const EdgeInsets.only(right: 16, bottom: 12),
                child: Align(
                  alignment: Alignment.centerRight,
                  child: Text(
                    '${widget.input.length}/2000',
                    style: TextStyle(
                      fontSize: 11,
                      color: AppTheme.textMuted.withValues(alpha: 0.5),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        
        // Error Message
        if (widget.error != null) ...[
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: AppTheme.errorColor.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppTheme.errorColor.withValues(alpha: 0.3),
              ),
            ),
            child: Row(
              children: [
                Icon(
                  Icons.error_outline,
                  color: AppTheme.errorColor,
                  size: 18,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    widget.error!,
                    style: TextStyle(
                      color: AppTheme.errorColor,
                      fontSize: 13,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
        
        const SizedBox(height: 16),
        
        // Action Buttons
        Row(
          children: [
            // Generate/Enhance Button
            Expanded(
              flex: 3,
              child: GestureDetector(
                onTap: widget.loading || widget.input.trim().isEmpty ? null : widget.onSubmit,
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  decoration: BoxDecoration(
                    gradient: widget.loading || widget.input.trim().isEmpty
                        ? null
                        : AppTheme.primaryGradient,
                    color: widget.loading || widget.input.trim().isEmpty
                        ? AppTheme.backgroundLight.withValues(alpha: 0.2)
                        : null,
                    borderRadius: BorderRadius.circular(12),
                    boxShadow: (widget.loading || widget.input.trim().isEmpty)
                        ? null
                        : AppTheme.softShadow,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (widget.loading)
                        SizedBox(
                          height: 18,
                          width: 18,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              widget.input.trim().isEmpty
                                  ? AppTheme.textMuted
                                  : Colors.white,
                            ),
                          ),
                        )
                      else
                        Icon(
                          widget.mode == AppMode.reply ? Icons.bolt : Icons.edit_rounded,
                          size: 18,
                          color: widget.input.trim().isEmpty
                              ? AppTheme.textDisabled
                              : Colors.white,
                        ),
                      const SizedBox(width: 8),
                      Text(
                        widget._buttonText,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: widget.loading || widget.input.trim().isEmpty
                              ? AppTheme.textDisabled
                              : Colors.white,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            
            const SizedBox(width: 12),
            
            // Clear Button
            GestureDetector(
              onTap: widget.onClear,
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.backgroundLight.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppTheme.borderColor.withValues(alpha: 0.5)),
                ),
                child: Icon(
                  Icons.delete_outline_rounded,
                  size: 20,
                  color: AppTheme.textMuted,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
